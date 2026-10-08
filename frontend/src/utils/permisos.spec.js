import { ADMIN_PRUEBA, CLIENTE_PRUEBA, VENDEDOR_PRUEBA } from '../testing/datosPrueba.js'
import { esAdministrador, puedeEntrarAlPanel } from './permisos.js'

describe('permisos por rol', () => {
  it('Administrador y Vendedor entran al panel; Cliente y visitante no', () => {
    expect(puedeEntrarAlPanel(ADMIN_PRUEBA)).toBeTrue()
    expect(puedeEntrarAlPanel(VENDEDOR_PRUEBA)).toBeTrue()
    expect(puedeEntrarAlPanel(CLIENTE_PRUEBA)).toBeFalse()
    expect(puedeEntrarAlPanel(null)).toBeFalse()
  })

  it('solo el Administrador puede administrar', () => {
    expect(esAdministrador(ADMIN_PRUEBA)).toBeTrue()
    expect(esAdministrador(VENDEDOR_PRUEBA)).toBeFalse()
    expect(esAdministrador(null)).toBeFalse()
  })
})
