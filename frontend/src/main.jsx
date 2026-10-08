/*
 * Punto de entrada: monta la aplicación en el <div id="root"> de index.html.
 *
 * BrowserRouter va aquí y no dentro de App a propósito: así las pruebas pueden
 * envolver App en un MemoryRouter y decidir en qué URL "parte" la prueba,
 * sin depender de la barra de direcciones del navegador.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Primero Bootstrap y después la identidad de INFORCORE: en CSS gana la regla
// que se carga al final, así nuestros colores reemplazan los de Bootstrap.
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/inforcore.css'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
