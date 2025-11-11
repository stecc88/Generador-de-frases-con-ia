# 🚀 Proyecto: Generador de Frases Full-Stack (con IA y Autenticación)

**Ver la aplicación en vivo:**
* **Frontend (Vercel):** `[Pega aquí tu link de Vercel]`
* **Backend (Render):** `[Pega aquí tu link de Render (ej: ...onrender.com/api/login)]`

---

## 💡 Resumen del Proyecto

Esta es una aplicación web full-stack completa construida desde cero. Permite a los usuarios registrarse, iniciar sesión de forma segura, y generar frases inspiradoras usando la API de Google Gemini.

El núcleo del proyecto es una arquitectura **multi-usuario segura**: cada usuario tiene su propia cuenta y solo puede ver, crear o borrar las frases que le pertenecen. La aplicación es **responsive** (se adapta a móviles) y es **bilingüe** (Español 🇪🇸 e Italiano 🇮🇹).

## 🎬 Demo (¡Recomendado!)

*[Te recomiendo grabar un GIF corto (usando Giphy Capture o una herramienta similar) que muestre el flujo de la app (Registro -> Login -> Generar Frase -> Logout) y pegarlo aquí. Esto es lo primero que verá un reclutador.]*

`[Pega aquí tu GIF de demostración]`

---

## ✨ Características Principales

### 1. Autenticación y Seguridad (Full-Stack)
* **Registro de Usuarios:** Creación de usuarios con contraseñas "hasheadas" usando **`bcrypt`**.
* **Inicio de Sesión (Login):** Verificación de credenciales y generación de un **JSON Web Token (JWT)** firmado y con tiempo de expiración.
* **Rutas de Backend Protegidas:** Un *middleware* personalizado en el backend (`autenticarToken`) intercepta cada petición a la API. Si el `token` JWT no es válido o no existe, la petición es rechazada.
* **Vistas de Frontend Protegidas:** Un componente (`<ProtectedRoute>`) en React redirige automáticamente a los usuarios no autenticados a la página de `/login`, protegiendo la página principal.
* **Cierre de Sesión (Logout):** Destruye el `token` guardado en `localStorage` y redirige al login.

### 2. Arquitectura Multi-Usuario (Multi-Tenant)
* **Datos Privados:** La base de datos utiliza **Llaves Foráneas (Foreign Keys)**. Cada frase en la tabla `frases` está enlazada a un `usuario_id`.
* **Lógica de API Segura:** Todas las consultas SQL (`GET`, `POST`, `PUT`, `DELETE`) están filtradas con `WHERE usuario_id = $1`. Esto garantiza que un usuario (incluso si intenta forzarlo) **nunca** pueda ver o modificar frases que no le pertenecen.

### 3. Integración con IA (Google Gemini)
* **Generación de Contenido:** Los usuarios pueden generar frases nuevas proporcionando un "tema" (ej: "éxito").
* **Prompt Dinámico y Bilingüe:** El frontend detecta el idioma seleccionado (ES o IT) y lo envía al backend. El backend ajusta dinámicamente el *prompt* de Gemini para solicitar la frase en el idioma correcto (`"Responde ÚNICAMENTE en idioma Italiano..."`).

### 4. Interfaz de Usuario (UI/UX)
* **Enrutamiento (Routing):** Construido como una **Single Page Application (SPA)** usando `React Router DOM`. La aplicación maneja 4 rutas (`/`, `/login`, `/registro` y la ruta protegida).
* **Diseño Responsive:** Creado con **Tailwind CSS** usando un enfoque "Mobile-First". La interfaz se adapta fluidamente desde móviles hasta pantallas de escritorio.
* **Internacionalización (i18n):** La aplicación es completamente bilingüe usando `i18next`. Los textos, errores y placeholders se cargan desde archivos `JSON` de traducción (`es.json`, `it.json`).

---

## 🧠 Desafíos Técnicos y Soluciones

Este proyecto fue un ejercicio completo de desarrollo full-stack que requirió resolver varios problemas clave:

1.  **El Desafío de la Autenticación:** Implementar un sistema de login desde cero.
    * **Solución:** Se utilizó `bcrypt` para el hasheo de contraseñas, asegurando que nunca se almacenen contraseñas en texto plano. Se usó `jsonwebtoken` (JWT) para crear un "pase" digital en el login, que el frontend guarda en `localStorage`. Este `token` se envía en el *header* `Authorization` de cada petición subsecuente.

2.  **El Desafío de la "Fuga de Datos":** Evitar que el "Usuario A" viera las frases del "Usuario B".
    * **Solución:** Se implementó una arquitectura de base de datos relacional. La tabla `frases` se diseñó con una columna `usuario_id` que actúa como una **Llave Foránea (Foreign Key)**, enlazándola a la tabla `usuarios`. Cada consulta de la API (ej: `GET /api/frases`) fue filtrada usando el `id` del usuario (extraído del JWT verificado) con un `WHERE usuario_id = $1`.

3.  **El Desafío del Despliegue (Deployment):** Una aplicación full-stack no puede desplegarse en un solo lugar como Vercel, ya que el backend (un servidor Express) necesita estar "encendido" 24/7.
    * **Solución:** Se implementó una arquitectura de **3 niveles**:
        1.  **Frontend (React):** Desplegado en **Vercel** para la mayor velocidad de entrega estática.
        2.  **Backend (Node/Express):** Desplegado en **Render** (un servicio PaaS) que mantiene el servidor `app.listen()` corriendo.
        3.  **Base de Datos (PostgreSQL):** Desplegada en **Neon** (un proveedor de bases de datos serverless en la nube) para que sea accesible desde cualquier lugar.

4.  **El Desafío de la Configuración de Producción:** El servidor de Render fallaba porque `dotenv` (usado para `localhost`) interfería con las variables de entorno de producción.
    * **Solución:** Se modificó el `index.js` del backend para que `dotenv.config()` **solo** se ejecute si `process.env.NODE_ENV !== 'production'`, permitiendo que Render inyecte sus propias variables de forma segura.

---

## 🛠️ Stack de Tecnologías

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React (con Vite) | UI reactiva y moderna. |
| | React Router DOM | Enrutamiento de páginas (SPA). |
| | Tailwind CSS | Estilizado "utility-first" y responsive. |
| | i18next | Internacionalización (bilingüe). |
| **Backend** | Node.js (ES Modules) | Entorno de ejecución del servidor. |
| | Express | Framework para la API RESTful. |
| | PostgreSQL | Base de datos relacional. |
| | `node-pg` | "Driver" de conexión a PostgreSQL. |
| **Seguridad** | `bcrypt` | Hasheo de contraseñas. |
| | `jsonwebtoken` (JWT) | Creación y verificación de tokens de sesión. |
| | `cors` | Habilitar la comunicación entre dominios. |
| **APIs** | Google Gemini | Generación de frases por IA. |
| **Despliegue** | **Vercel** (Frontend) | Hosting estático de alta velocidad. |
| | **Render** (Backend) | Hosting de servicios web (Node.js). |
| | **Neon** (Base de Datos) | Hosting de PostgreSQL en la nube. |

---

## ⚙️ Instalación y Puesta en Marcha Local

Este proyecto es un **monorepo** que contiene dos carpetas: `backend-frases` y `frontend-frases`. Para ejecutar la aplicación localmente, **ambas deben estar corriendo al mismo tiempo** en dos terminales separadas.

### 1. Configuración del Backend (Servidor)

1.  Navega a la carpeta del backend: `cd backend-frases`
2.  Instala las dependencias: `npm install`
3.  **Configura la Base de Datos (PostgreSQL):**
    * Crea una base de datos local (ej: `frases_app`).
    * Ejecuta el script SQL (incluido en `README.md` o `backend-frases/setup.sql`) para crear las tablas `usuarios` y `frases`.
4.  **Configura las Variables de Entorno:**
    * Crea un archivo `.env` en la raíz de `backend-frases`.
    * Copia el contenido de `README.md` (sección "Instalación") y rellena tus claves de `DB_...`, `GEMINI_API_KEY` y `JWT_SECRET`.
5.  **Ejecuta el servidor backend:** `npm run dev`
    * El backend estará corriendo en `http://localhost:3000`.

### 2. Configuración del Frontend (Cliente)

1.  Abre una **nueva terminal**.
2.  Navega a la carpeta del frontend: `cd frontend-frases`
3.  Instala las dependencias: `npm install`
4.  **Ejecuta el servidor frontend:** `npm run dev`
    * El frontend se abrirá en `http://localhost:5173`.