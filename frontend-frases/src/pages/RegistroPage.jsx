import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 

const API_BASE_URL = 'https://mi-generador-frases-backend.onrender.com/api';

function RegistroPage() {
  // 2. Inicializar i18n
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 3. Usar 't' para los errores
    if (password.length < 6) {
      setError(t('registro.error_largo'));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Mapear el error del backend a la traducción
        const errorKey = data.error === 'El email ya está registrado.' ? 'registro.error_email_registrado' : 'registro.error_generico';
        throw new Error(t(errorKey));
      }

      setSuccess(t('registro.exito'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  // 4. Función para cambiar idioma
  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-md">
        
        {/* --- Selector de Idioma --- */}
        <div className="w-full flex justify-center mb-4 space-x-2">
          <button 
            onClick={() => cambiarIdioma('es')} 
            className="font-bold py-1 px-3 rounded-lg bg-white shadow"
          >
            🇪🇸 ES
          </button>
          <button 
            onClick={() => cambiarIdioma('it')}
            className="font-bold py-1 px-3 rounded-lg bg-white shadow"
          >
            🇮🇹 IT
          </button>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-lg shadow-lg"
        >
          {/* 5. Usar 't' en todo el texto */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-orange-600 mb-6 md:mb-8">
            {t('registro.titulo')}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              {t('registro.email_label')}
            </label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.email_placeholder')}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required 
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              {t('registro.password_label')}
            </label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password_placeholder')}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-base md:text-lg transition duration-200 shadow-md"
          >
            {t('registro.boton')}
          </button>
          
        </form>

        <p className="text-center text-gray-600 mt-6">
          {t('registro.link_login_pregunta')}{' '}
          <Link 
            to="/login" 
            className="text-orange-600 hover:underline"
          >
            {t('registro.link_login_accion')}
          </Link>
        </p>
      </main>
    </div>
  );
}

export default RegistroPage;