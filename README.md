# 🚀 Generador de Frases con IA — Proyecto Full-Stack (Arquitectura 3 Capas)

Aplicación web **Full-Stack** diseñada para demostrar habilidades avanzadas en desarrollo, seguridad, despliegue y arquitectura profesional.

---

## 🌐 Aplicación en Producción

| Componente | Servicio | Enlace |
|-------------|-----------|--------|
| 🖥️ **Frontend (Vercel)** | React + Vite | 👉 [generador-de-frases-con-ia.vercel.app/registro](https://generador-de-frases-con-ia.vercel.app/registro) |
| ⚙️ **Backend (Render)** | Node.js + Express | 👉 [mi-generador-frases-backend.onrender.com](https://mi-generador-frases-backend.onrender.com) |

---

## 💡 Resumen del Proyecto

Este proyecto simula un entorno de **producción multiusuario y seguro**, donde los usuarios pueden:

- Registrarse e iniciar sesión con autenticación **JWT**.  
- Generar frases inspiradoras usando la **API de Google Gemini**.  
- Ver solo sus propias frases (aislamiento por usuario).  
- Usar la aplicación en **dos idiomas** (Español 🇪🇸 / Italiano 🇮🇹).  

El proyecto se centra en tres pilares fundamentales:

1. 🔐 Seguridad avanzada y autenticación JWT  
2. 🧩 Arquitectura multicapa profesional (Frontend + Backend + DB)  
3. ☁️ Despliegue real en entornos de producción (Vercel + Render + Neon)

---

## 🧠 Desafíos Técnicos y Soluciones

### 🔸 1. Autenticación y Autorización Multiusuario
**Problema:** Garantizar que cada usuario solo acceda a sus propias frases.  
**Solución:** Se agregó una llave foránea `usuario_id` en la tabla `frases` enlazada a `usuarios`.  
Cada endpoint (`GET`, `PUT`, `DELETE`) usa `WHERE usuario_id = $1`, donde el ID proviene del token JWT.

➡️ Esto evita el acceso cruzado a datos incluso manipulando IDs desde el cliente.

---

### 🔸 2. Enrutamiento de Cliente en Vercel (React Router)

**Problema:** Acceder directamente a rutas como `/login` producía un error `404: NOT_FOUND`.  
**Solución:** Se creó una regla de reescritura en `vercel.json`:

```json
// frontend-frases/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 🔸 3. Dependencias en Producción (Vercel)

**Problema:** Error `Cannot find module 'autoprefixer'` porque Vercel no instala `devDependencies`.  
**Solución:** Se movieron `tailwindcss`, `postcss` y `autoprefixer` a `dependencies` en `package.json`.

---

### 🔸 4. Variables de Entorno en Render

**Problema:** `dotenv` sobrescribía variables de entorno de producción.  
**Solución:** Se ejecuta `dotenv.config()` **solo si** `NODE_ENV !== 'production'`, para permitir que Render inyecte sus propias variables sin conflicto.

---

## 🏗️ Arquitectura de Despliegue (3 Capas)

| Capa | Tecnología | Servicio | Rol |
|------|-------------|-----------|-----|
| 🎨 **Frontend** | React (Vite + TailwindCSS) | **Vercel** | SPA con routing cliente |
| ⚙️ **Backend** | Node.js / Express | **Render** | API REST segura con JWT |
| 🗄️ **Base de Datos** | PostgreSQL | **Neon** | Base de datos en la nube |

---

## 🧰 Tecnologías Principales

| Área | Tecnología | Descripción |
|------|-------------|--------------|
| 🔐 **Autenticación** | `bcrypt`, `jsonwebtoken` | Hash seguro + Tokens JWT con expiración |
| 🤖 **Integración IA** | Google Gemini SDK | Generación dinámica de frases |
| 🎨 **Estilos** | Tailwind CSS | Diseño responsive “Mobile-First” |
| 🌍 **Internacionalización** | i18next | Soporte multilenguaje (ES / IT) |
| 🧱 **ORM / Querys** | pg | Conexión segura a PostgreSQL |

---

## ⚙️ Instalación y Ejecución Local

Este proyecto es un **monorepo** que contiene dos carpetas:  
`backend-frases` y `frontend-frases`.  
Para ejecutar la aplicación localmente, **ambas deben estar corriendo al mismo tiempo** en dos terminales separadas.

---

### 🖥️ Backend (`backend-frases`)

```bash
cd backend-frases
npm install
```

1. **Crea la base de datos PostgreSQL** y ejecuta el script SQL con las tablas `usuarios` y `frases`.  
2. **Crea el archivo `.env`** con las siguientes variables:

```env
DATABASE_URL=postgresql://TU_URL
GEMINI_API_KEY=TU_API_KEY
JWT_SECRET=tu_secreto_seguro
```

3. **Ejecuta:**
```bash
npm run dev
```

👉 El backend correrá en: [http://localhost:3000](http://localhost:3000)

---

### 💻 Frontend (`frontend-frases`)

```bash
cd frontend-frases
npm install
npm run dev
```

👉 El frontend se abrirá en: [http://localhost:5173](http://localhost:5173)

---

## 🎮 Uso de la Aplicación

1. Abre [http://localhost:5173](http://localhost:5173)  
2. Regístrate con un nuevo usuario  
3. Inicia sesión  
4. Genera frases (solo visibles para tu cuenta)  
5. Borra o visualiza tus frases personales  

---

## 🧱 Estructura del Proyecto

```
/generador-de-frases
│
├── backend-frases/
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── db/
│
└── frontend-frases/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── hooks/
    └── public/
```

---

## 🧑‍💻 Autor

**Stecco Pedro Hernan**  
Full Stack Developer — MERN / PostgreSQL / Gemini API  
📧 **steccoh88@gmail.com**

🌐 [LinkedIn](#) | [GitHub](#)

⭐ *Si te gusta este proyecto, considera darle una estrella en GitHub para apoyar su desarrollo.*

---

© 2025 — Proyecto académico y demostrativo.
