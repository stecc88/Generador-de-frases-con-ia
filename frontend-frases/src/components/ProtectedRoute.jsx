// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Buscamos el token en el almacenamiento local
  const token = localStorage.getItem('token');

  // 2. Verificamos si el token existe
  if (!token) {
    // 3. Si NO hay token, redirigimos al usuario a la página de login
    return <Navigate to="/login" replace />;
  }

  // 4. Si SÍ hay token, mostramos la página que el usuario quería ver.
  // <Outlet /> es un marcador de posición de React Router para "la página hija"
  return <Outlet />;
};

export default ProtectedRoute;