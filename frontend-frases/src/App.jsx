// src/App.jsx (Modificado)

import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import ProtectedRoute from './components/ProtectedRoute' // <-- 1. IMPORTAR

function App() {
  return (
    <Routes>
      {/* 2. RUTAS PÚBLICAS (Cualquiera puede verlas) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      {/* 3. RUTAS PROTEGIDAS (Solo usuarios con token) */}
      <Route element={<ProtectedRoute />}>
        {/* Todas las rutas "hijas" aquí dentro estarán protegidas */}
        <Route path="/" element={<HomePage />} />
        {/* Si tuvieras más rutas protegidas (ej: /perfil), irían aquí */}
      </Route>
      
    </Routes>
  )
}

export default App