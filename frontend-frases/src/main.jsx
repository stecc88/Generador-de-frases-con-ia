import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n'; // Importa la configuración de i18n

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando...</div>}>  
    <BrowserRouter> 
    <App />
      </BrowserRouter> 
      </Suspense>
  </StrictMode>,
)
