# 🚀 Proyecto: Generador de Frases Full-Stack (con IA y Autenticación)

Esta es una aplicación web full-stack completa construida con el stack MERN (PostgreSQL en lugar de MongoDB) y React. Permite a los usuarios registrarse, iniciar sesión, y generar frases inspiradoras usando la API de Google Gemini.

La aplicación es segura, multi-usuario (cada usuario solo ve sus propias frases), responsive (se adapta a móviles) y bilingüe (Español e Italiano).

## ✨ Características Principales

* **Autenticación y Autorización Segura:**
    * Sistema completo de **Registro** y **Login** de usuarios.
    * Uso de **`bcrypt`** para hashear y proteger las contraseñas en la base de datos.
    * Gestión de sesiones mediante **JSON Web Tokens (JWT)** con tiempo de expiración.

* **Arquitectura Multi-Usuario (Multi-Tenant):**
    * **Rutas de API Protegidas:** El backend usa un *middleware* personalizado para verificar el JWT en cada petición a las rutas de frases.
    * **Datos Privados:** Los usuarios solo pueden ver, crear, actualizar o borrar las frases que les pertenecen (enlazadas por `usuario_id`).

* **Frontend Moderno y Completo:**
    * **React Router DOM:** Aplicación de varias páginas (Login, Registro, Home) con rutas protegidas que redirigen a los usuarios no autenticados.
    * **Diseño Responsive (Tailwind CSS):** Interfaz "Mobile-First" que se adapta a cualquier tamaño de pantalla.
    * **Internacionalización (i18n):** La aplicación es completamente bilingüe (🇪🇸 Español / 🇮🇹 Italiano) usando `i18next`.

* **Integración con IA:**
    * Se conecta a la API de **Google Gemini** para generar contenido nuevo (frases) basado en un tema.
    * El prompt se ajusta dinámicamente según el idioma seleccionado por el usuario.

* **Base de Datos Relacional:**
    * Utiliza **PostgreSQL** para almacenar usuarios y frases.
    * Usa **Llaves Foráneas (Foreign Keys)** para enlazar de forma segura las frases con sus usuarios correspondientes.

---

## 🛠️ Stack de Tecnologías

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React (con Vite) | Para construir la interfaz de usuario reactiva. |
| | React Router DOM | Para el enrutamiento de páginas (`/`, `/login`, `/registro`). |
| | i18next | Para la internacionalización (ES / IT). |
| | Tailwind CSS | Para el estilizado rápido y responsive. |
| **Backend** | Node.js (con ES Modules) | El entorno de ejecución del servidor. |
| | Express | El framework para construir la API RESTful. |
| | PostgreSQL | La base de datos relacional. |
| | `node-pg` | El "driver" para conectar Node.js con PostgreSQL. |
| **Seguridad** | `bcrypt` | Para "hashear" y proteger las contraseñas. |
| | `jsonwebtoken` (JWT) | Para crear y verificar los tokens de sesión. |
| | `cors` | Para permitir la comunicación entre el frontend y el backend. |
| **APIs** | Google Gemini | Para la generación de contenido por IA. |

---

## 🚀 Instalación y Puesta en Marcha

Este proyecto es un **monorepo** que contiene dos carpetas: `backend-frases` y `frontend-frases`. Para ejecutar la aplicación localmente, **ambas deben estar corriendo al mismo tiempo** en dos terminales separadas.

### 1. Configuración del Backend (Servidor)

1.  Navega a la carpeta del backend:
    ```bash
    cd backend-frases
    ```
2.  Instala todas las dependencias (Express, pg, cors, bcrypt, jwt, etc.):
    ```bash
    npm install
    ```
3.  **Configura la Base de Datos (PostgreSQL):**
    * Abre pgAdmin y crea una nueva base de datos (ej: `frases_app`).
    * Abre la "Herramienta de Consultas" (Query Tool) para esa base de datos.
    * Copia y ejecuta el siguiente script SQL para crear las tablas:
    ```sql
    -- 1. Crear la tabla de usuarios
    CREATE TABLE usuarios (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    -- 2. Crear la tabla de frases (con el enlace al usuario)
    CREATE TABLE frases (
      id BIGSERIAL PRIMARY KEY,
      texto TEXT NOT NULL,
      autor VARCHAR(255),
      
      -- Llave Foránea que conecta con la tabla 'usuarios'
      usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE
    );
    ```

4.  **Configura las Variables de Entorno:**
    * Crea un archivo llamado `.env` en la raíz de la carpeta `backend-frases`.
    * Copia y pega el siguiente contenido, reemplazando los valores con tus propias credenciales:
    ```ini
    # Configuración de la Base de Datos PostgreSQL
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=frases_app
    DB_PASSWORD=tu_password_de_postgres
    DB_PORT=5432

    # Clave de API de Google Gemini (Obtener de Google AI Studio)
    GEMINI_API_KEY=AQUI_VA_TU_CLAVE_DE_GEMINI

    # Secreto para firmar los JWT (JSON Web Tokens)
    # Puede ser cualquier frase larga y aleatoria
    JWT_SECRET=esta_es_mi_palabra_secreta_para_los_tokens_123
    ```

5.  **Ejecuta el servidor backend:**
    ```bash
    npm run dev
    ```
    *(Nota: El script `dev` (definido en `package.json`) usualmente usa `nodemon` para reiniciar el servidor automáticamente).*
    * Tu backend ahora estará corriendo en `http://localhost:3000`.

---

### 2. Configuración del Frontend (Cliente)

1.  Abre una **nueva terminal**.
2.  Navega a la carpeta del frontend:
    ```bash
    cd frontend-frases
    ```
3.  Instala todas las dependencias (React, router, i18next, tailwind, etc.):
    ```bash
    npm install
    ```
4.  **Configuración de la API:**
    * ¡No se necesita un `.env`! La URL del backend (`http://localhost:3000/api`) ya está configurada en los archivos de React.
    * Los archivos de traducción (i18n) ya se encuentran en la carpeta `public/locales`.

5.  **Ejecuta el servidor frontend:**
    ```bash
    npm run dev
    ```
    * Tu frontend ahora estará corriendo y se abrirá en `http://localhost:5173`.

---

## 🎮 Cómo Usar la Aplicación

1.  Abre `http://localhost:5173` en tu navegador.
2.  Serás redirigido automáticamente a la página de `/login`.
3.  Selecciona tu idioma (🇪🇸 o 🇮🇹).
4.  Haz clic en el enlace "Regístrate aquí".
5.  Crea una nueva cuenta de usuario.
6.  Serás redirigido de nuevo a `/login`. Inicia sesión con las credenciales que acabas de crear.
7.  ¡Listo! Ahora estás en la página principal, donde puedes:
    * Generar nuevas frases usando la IA (¡en tu idioma seleccionado!).
    * Ver la lista de todas las frases *que tú has creado*.
    * Borrar frases de tu lista.
    * Cerrar sesión.