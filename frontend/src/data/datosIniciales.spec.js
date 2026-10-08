/*
 * Pruebas de "contrato" de los datos semilla: si alguien edita a mano
 * src/data y deja un dato que rompe una regla de negocio, esta prueba falla
 * antes de que el error llegue a la tienda.
 */
import { calcularTotal } from '../utils/calculos.js'
import { tieneErrores, validarProducto, validarUsuario } from '../utils/validaciones.js'
import { CATEGORIAS_INICIALES } from './categoriasIniciales.js'
import { ORDENES_INICIALES } from './ordenesIniciales.js'
import { PRODUCTOS_INICIALES } from './productosIniciales.js'
import { REGIONES } from './regionesComunas.js'
import { USUARIOS_INICIALES } from './usuariosIniciales.js'

function comunaExiste(nombreRegion, comuna) {
  return REGIONES.find((r) => r.nombre === nombreRegion)?.comunas.includes(comuna) ?? false
}

describe('datos iniciales', () => {
  it('tiene las 16 regiones de Chile con sus 346 comunas', () => {
    expect(REGIONES.length).toBe(16)
    expect(REGIONES.reduce((total, r) => total + r.comunas.length, 0)).toBe(346)
  })

  it('cada producto cumple las reglas, tiene código único y una categoría existente', () => {
    const idsCategoria = CATEGORIAS_INICIALES.map((c) => c.id)
    const codigos = PRODUCTOS_INICIALES.map((p) => p.codigo)

    expect(PRODUCTOS_INICIALES.length).toBe(14)
    expect(new Set(codigos).size).toBe(codigos.length)
    PRODUCTOS_INICIALES.forEach((producto) => {
      expect(validarProducto(producto)).withContext(producto.codigo).toEqual({})
      expect(idsCategoria).withContext(producto.codigo).toContain(producto.idCategoria)
    })
  })

  it('cada usuario cumple las reglas de registro y vive en una comuna real', () => {
    USUARIOS_INICIALES.forEach((usuario) => {
      expect(tieneErrores(validarUsuario(usuario, { exigirTipo: true }))).withContext(usuario.correo).toBeFalse()
      expect(comunaExiste(usuario.region, usuario.comuna)).withContext(usuario.correo).toBeTrue()
    })
  })

  it('hay al menos un usuario por rol para poder probar cada perfil', () => {
    const roles = USUARIOS_INICIALES.map((u) => u.tipoUsuario)
    expect(roles).toContain('Administrador')
    expect(roles).toContain('Vendedor')
    expect(roles).toContain('Cliente')
  })

  it('cada orden tiene el total correcto y una dirección con comuna real', () => {
    ORDENES_INICIALES.forEach((orden) => {
      expect(orden.total).withContext(`orden ${orden.numero}`).toBe(calcularTotal(orden.items))
      expect(comunaExiste(orden.direccion.region, orden.direccion.comuna)).withContext(`orden ${orden.numero}`).toBeTrue()
    })
  })
})
