/**
 * Estado global de la sesión: quién inició sesión, o nadie (null).
 *
 * Lo necesitan el menú (nombre y "Cerrar sesión"), el checkout (autocompletar
 * datos), las rutas protegidas del admin (revisar el rol) y el perfil.
 * Mismo esquema de tres archivos que el carrito (ver CarritoProvider.jsx).
 *
 * La sesión se guarda en localStorage para que sobreviva a una recarga de la
 * página, como se vio en la clase del 21-09.
 */
import { useState } from 'react'

import { CLAVES, eliminarDato, guardarDato, leerDato } from '../services/almacenamiento.js'
import { autenticarUsuario } from '../services/usuariosService.js'
import { SesionContext } from './SesionContext.js'

/** @param {{children: React.ReactNode}} props */
export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => leerDato(CLAVES.sesion, null))

  /**
   * @param {string} correo
   * @param {string} contrasena
   * @returns {object|null} El usuario si las credenciales son correctas; si no, null.
   */
  function iniciarSesion(correo, contrasena) {
    const autenticado = autenticarUsuario(correo, contrasena)
    if (autenticado) {
      // Se guarda el usuario SIN contraseña: autenticarUsuario ya la quitó.
      guardarDato(CLAVES.sesion, autenticado)
      setUsuario(autenticado)
    }
    return autenticado
  }

  function cerrarSesion() {
    eliminarDato(CLAVES.sesion)
    setUsuario(null)
  }

  /**
   * Refresca los datos de la sesión cuando el usuario edita su perfil, para
   * que el menú y el checkout muestren lo nuevo sin volver a iniciar sesión.
   *
   * @param {object} usuarioActualizado - Sin contraseña.
   */
  function actualizarSesion(usuarioActualizado) {
    guardarDato(CLAVES.sesion, usuarioActualizado)
    setUsuario(usuarioActualizado)
  }

  const valor = { usuario, iniciarSesion, cerrarSesion, actualizarSesion }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
