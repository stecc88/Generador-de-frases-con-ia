import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:3000/api';

function HomePage() {
  const { t, i18n } = useTranslation();
  const [listaDeFrases, setListaDeFrases] = useState([]);
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  };

  useEffect(() => {
    handleGetAllFrases();
  }, []); // El `[]` vacío es correcto aquí

  const handleGetAllFrases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/frases`, {
        headers: getAuthHeaders()
      });
      if (response.status === 401 || response.status === 403) {
        navigate('/login');
        return; 
      }
      if (!response.ok) throw new Error(t('alertas.error_cargar'));
      
      const data = await response.json();
      setListaDeFrases(data);
    } catch (error) {
      console.error(error);
      alert(error.message); 
    }
  };

  const handleGenerateFrase = async (e) => {
    e.preventDefault();
    if (!tema) return;
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/frase`, {
        method: 'POST',
        headers: getAuthHeaders(),
        
        body: JSON.stringify({ 
          tema: tema,
          lang: i18n.language // Enviamos el idioma actual (ej: 'es' o 'it')
        }),
        // --- FIN---
      });
      if (!response.ok) throw new Error(t('alertas.error_generar'));
      handleGetAllFrases(); 
      setTema('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFrase = async (idParaBorrar) => {
    if (!window.confirm(t('alertas.confirmar_borrado', { id: idParaBorrar }))) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/frase/${idParaBorrar}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error(t('alertas.error_borrar'));
      handleGetAllFrases();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
  };

  // --- RENDERIZADO (con 't') ---
  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* --- Selector de Idioma --- */}
      <div className="w-full max-w-2xl flex justify-end mb-4 space-x-2">
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
      
      <header className="w-full max-w-2xl text-center mb-8 md:mb-12 flex justify-between items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-orange-600">
          {t('header.titulo')}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 text-sm md:py-2 md:px-4 md:text-base rounded-lg shadow"
        >
          {t('header.logout')}
        </button>
      </header>

      <main className="w-full max-w-2xl">
        
        {/* Formulario POST */}
        <section className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-orange-700">
            {t('form.titulo')}
          </h2>
          <form onSubmit={handleGenerateFrase}>
            <label htmlFor="tema" className="block text-sm font-medium text-gray-600 mb-2">
              {t('form.label')}
            </label>
            <input 
              id="tema"
              type="text" 
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder={t('form.placeholder')}
              className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-base md:text-lg transition duration-200 shadow-md mt-4 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? t('form.boton_cargando') : t('form.boton')}
            </button>
          </form>
        </section>

        {/* Lista de Frases (GET y DELETE) */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
            {t('lista.titulo')}
          </h2>
          <div className="space-y-4">
            
            {listaDeFrases.map((frase) => (
              <div key={frase.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1 mb-4 md:mb-0">
                  <blockquote className="text-base md:text-lg italic text-gray-700">
                    "{frase.texto}"
                  </blockquote>
                  <p className="text-right text-orange-500 mt-2">
                    — {frase.autor}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteFrase(frase.id)}
                  className="w-full md:w-auto ml-0 md:ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg md:rounded-full transition duration-200"
                  title={t('lista.borrar_title')}
                >
                  X
                </button>
              </div>
            ))}
            
            {listaDeFrases.length === 0 && (
              <p className="text-center text-gray-500">{t('lista.vacia')}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage;