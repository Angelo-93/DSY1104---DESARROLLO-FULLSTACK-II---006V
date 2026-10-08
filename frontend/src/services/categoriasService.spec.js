import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES } from './almacenamiento.js'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from './categoriasService.js'

describe('categoriasService (con localStorage simulado)', () => {
  beforeEach(() => {
    instalarLocalStorageFalso({
      [CLAVES.categorias]: [
        { id: 'monitores', nombre: 'Monitores', descripcion: '' },
        { id: 'vacia', nombre: 'Vacía', descripcion: '' },
      ],
      [CLAVES.productos]: [{ codigo: 'MN-1', idCategoria: 'monitores', precio: 1, stock: 1 }],
    })
  })

  it('crea una categoría con id generado desde el nombre y único', () => {
    const nueva = crearCategoria({ nombre: 'Redes y WiFi', descripcion: 'Routers' })
    expect(nueva.id).toBe('redes-y-wifi')

    // Mismo slug que una existente pero distinto nombre → se agrega un número.
    const otra = crearCategoria({ nombre: 'Vacia!' + ' 2' })
    expect(otra.id).toBe('vacia-2')
    expect(listarCategorias().length).toBe(4)
  })

  it('rechaza nombres repetidos aunque cambien mayúsculas o tildes', () => {
    expect(() => crearCategoria({ nombre: '  MONITORES ' })).toThrowError(/Ya existe/)
    expect(() => actualizarCategoria('vacia', { nombre: 'monitores' })).toThrowError(/Ya existe/)
  })

  it('al renombrar mantiene el id, así los productos no quedan huérfanos', () => {
    actualizarCategoria('monitores', { nombre: 'Pantallas' })
    expect(obtenerCategoria('monitores').nombre).toBe('Pantallas')
  })

  it('no elimina una categoría con productos, pero sí una vacía', () => {
    expect(() => eliminarCategoria('monitores')).toThrowError(/tiene 1 producto/)

    eliminarCategoria('vacia')
    expect(obtenerCategoria('vacia')).toBeNull()
  })
})
