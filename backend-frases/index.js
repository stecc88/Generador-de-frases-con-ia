// =================================================================
// 1. IMPORTACIONES Y CONFIGURACIÓN DE ENTORNO
// =================================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const { Pool } = pkg;

// =================================================================
// 2. CONFIGURACIONES BÁSICAS
// =================================================================
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- Cliente de Gemini (usa GEMINI_API_KEY desde el entorno)
const ai = new GoogleGenAI({});

// =================================================================
// 3. MIDDLEWARE DE AUTENTICACIÓN JWT
// =================================================================
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido." });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado." });
    req.usuario = usuario;
    next();
  });
}

// =================================================================
// 4. RUTAS DE AUTENTICACIÓN
// =================================================================

// --- Registro ---
app.post("/api/registro", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });

    const hash = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO usuarios (email, password_hash) VALUES ($1, $2) RETURNING id, email";
    const result = await pool.query(sql, [email, hash]);
    res.status(201).json({ mensaje: "Usuario creado", usuario: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email ya registrado." });
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// --- Login ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas." });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Credenciales inválidas." });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ mensaje: "Login exitoso", token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// =================================================================
// 5. CRUD DE FRASES (RUTAS PROTEGIDAS)
// =================================================================

// --- READ ALL ---
app.get("/api/frases", autenticarToken, async (req, res) => {
  try {
    const { id } = req.usuario;
    const sql = "SELECT id, texto, autor FROM frases WHERE usuario_id=$1 ORDER BY id DESC";
    const result = await pool.query(sql, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error en GET /frases:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// --- CREATE (Generar con Gemini) ---
app.post("/api/frase", autenticarToken, async (req, res) => {
  try {
    const { id } = req.usuario;
    // 1. CAPTURAMOS 'lang' (idioma) del body
    const { tema, lang } = req.body;
    
    if (!tema) return res.status(400).json({ error: "Debe ingresar un tema." });

    // 2. Mapeamos el 'lang' a un idioma completo
    const langMap = {
      es: "Español",
      it: "Italiano"
    };
    const idioma = langMap[lang] || "Español"; // Si no se envía, usa Español

    // 3. ACTUALIZAMOS EL PROMPT para que exija el idioma
    const prompt = `Genera una frase inspiradora corta sobre el tema "${tema}".
    Responde ÚNICAMENTE en idioma ${idioma}.
    No incluyas autor.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
        topK: 20,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const texto = response.text?.trim();
    if (!texto) {
      console.error("Respuesta de Gemini inválida:", response);
      return res.status(500).json({ error: "La IA no devolvió texto válido." });
    }

    const autor = "Generado por IA";
    await pool.query("INSERT INTO frases (texto, autor, usuario_id) VALUES ($1,$2,$3)", [
      texto,
      autor,
      id,
    ]);

    res.status(201).json({ mensaje: "Frase generada y guardada", texto, autor });
  } catch (err) {
    console.error("Error en POST /frase:", err);
    res.status(500).json({ error: "Error interno al generar la frase." });
  }
});

// --- UPDATE ---
app.put("/api/frase/:id", autenticarToken, async (req, res) => {
  try {
    const { id } = req.usuario;
    const idFrase = req.params.id;
    const { texto, autor } = req.body;
    const sql = "UPDATE frases SET texto=$1, autor=$2 WHERE id=$3 AND usuario_id=$4";
    const result = await pool.query(sql, [texto, autor, idFrase, id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Frase no encontrada o sin permiso." });
    res.json({ mensaje: "Frase actualizada" });
  } catch (err) {
    console.error("Error en PUT /frase:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// --- DELETE ---
app.delete("/api/frase/:id", autenticarToken, async (req, res) => {
  try {
    const { id } = req.usuario;
    const idFrase = req.params.id;
    const sql = "DELETE FROM frases WHERE id=$1 AND usuario_id=$2";
    const result = await pool.query(sql, [idFrase, id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Frase no encontrada o sin permiso." });
    res.status(204).send();
  } catch (err) {
    console.error("Error en DELETE /frase:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// =================================================================
// 6. ARRANQUE DEL SERVIDOR
// =================================================================
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión a PostgreSQL verificada.");
    client.release();
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
    process.exit(1);
  }
})();
