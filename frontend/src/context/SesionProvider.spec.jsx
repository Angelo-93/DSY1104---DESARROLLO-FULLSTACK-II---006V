import { act, renderHook } from '@testing-library/react'

import { useSesion } from '../hooks/useSesion.js'
import { CLAVES } from '../services/almacenamiento.js'
import { CLIENTE_PRUEBA } from '../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { SesionProvider } from './SesionProvider.jsx'

const USUARIO_GUARDADO = { ...CLIENTE_PRUEBA, contrasena: 'cliente1', region: 'R', comuna: 'C', direccion: 'D' }

function usarSesion() {
  return renderHook(() => useSesion(), { wrapper: SesionProvider })
}

describe('SesionProvider (estado de la sesión)', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.usuarios]: [USUARIO_GUARDADO] })
  })

  it('parte sin sesión y recupera una sesión guardada al recargar', () => {
    expect(usarSesion().result.current.usuario).toBeNull()

    memoria[CLAVES.sesion] = JSON.stringify(CLIENTE_PRUEBA)
    expect(usarSesion().result.current.usuario.nombre).toBe('Francisca')
  })

  it('con credenciales correctas inicia sesión y guarda al usuario sin contraseña', () => {
    const { result } = usarSesion()

    act(() => {
      result.current.iniciarSesion('fran@gmail.com', 'cliente1')
    })

    expect(result.current.usuario.nombre).toBe('Francisca')
    expect(JSON.parse(memoria[CLAVES.sesion]).contrasena).toBeUndefined()
  })

  it('con credenciales incorrectas devuelve null y no guarda nada', () => {
    const { result } = usarSesion()
    let respuesta

    act(() => {
      respuesta = result.current.iniciarSesion('fran@gmail.com', 'otra')
    })

    expect(respuesta).toBeNull()
    expect(result.current.usuario).toBeNull()
    // leerDato deja guardado el valor inicial (null) al montar: lo importante
    // es que no quedó ningún usuario guardado como sesión.
    expect(JSON.parse(memoria[CLAVES.sesion])).toBeNull()
  })

  it('cerrarSesion borra la sesión del estado y de localStorage', () => {
    memoria[CLAVES.sesion] = JSON.stringify(CLIENTE_PRUEBA)
    const { result } = usarSesion()

    act(() => result.current.cerrarSesion())

    expect(result.current.usuario).toBeNull()
    expect(memoria[CLAVES.sesion]).toBeUndefined()
  })
})
