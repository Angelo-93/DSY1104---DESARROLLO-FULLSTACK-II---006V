import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES } from './almacenamiento.js'
import {
  actualizarProducto,
  crearProducto,
  descontarStock,
  eliminarProducto,
  listarOfertas,
  listarProductos,
  listarProductosCriticos,
  listarProductosPorCategoria,
  obtenerProducto,
  verificarStock,
} from './productosService.js'

// Catálogo pequeño y controlado: cada producto existe para un caso.
const CATALOGO = [
  { codigo: 'AAA', nombre: 'Normal', idCategoria: 'c1', precio: 100, precioOferta: null, stock: 10, stockCritico: 2 },
  { codigo: 'BBB', nombre: 'En oferta', idCategoria: 'c1', precio: 100, precioOferta: 80, stock: 3, stockCritico: 3 },
  { codigo: 'CCC', nombre: 'Agotado', idCategoria: 'c2', precio: 50, precioOferta: null, stock: 0, stockCritico: null },
]

describe('productosService (con localStorage simulado)', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.productos]: CATALOGO })
  })

  function productosGuardados() {
    return JSON.parse(memoria[CLAVES.productos])
  }

  it('lee, busca sin importar mayúsculas y filtra por categoría, oferta y stock crítico', () => {
    expect(listarProductos().length).toBe(3)
    expect(obtenerProducto('bbb').nombre).toBe('En oferta')
    expect(obtenerProducto('ZZZ')).toBeNull()
    expect(listarProductosPorCategoria('c1').map((p) => p.codigo)).toEqual(['AAA', 'BBB'])
    expect(listarOfertas().map((p) => p.codigo)).toEqual(['BBB'])
    expect(listarProductosCriticos().map((p) => p.codigo)).toEqual(['BBB'])
  })

  it('crea un producto convirtiendo el texto del formulario a números y null', () => {
    const creado = crearProducto({
      codigo: ' ddd ',
      nombre: 'Nuevo',
      idCategoria: 'c2',
      precio: '1500',
      precioOferta: '',
      stock: '7',
      stockCritico: '',
    })

    expect(creado.codigo).toBe('DDD')
    expect(creado.precio).toBe(1500)
    expect(creado.precioOferta).toBeNull()
    expect(productosGuardados().length).toBe(4)
  })

  it('no permite crear un código repetido', () => {
    expect(() => crearProducto({ ...CATALOGO[0], codigo: 'aaa' })).toThrowError(/Ya existe/)
  })

  it('actualiza los datos manteniendo el código y elimina por código', () => {
    actualizarProducto('AAA', { ...CATALOGO[0], codigo: 'OTRO', nombre: 'Renombrado' })
    expect(obtenerProducto('AAA').nombre).toBe('Renombrado')

    eliminarProducto('AAA')
    expect(obtenerProducto('AAA')).toBeNull()
    expect(() => eliminarProducto('AAA')).toThrowError(/No existe/)
  })

  it('informa qué productos no tienen stock suficiente', () => {
    const faltantes = verificarStock([
      { codigo: 'AAA', cantidad: 2 },
      { codigo: 'CCC', cantidad: 1 },
    ])

    expect(faltantes).toEqual([{ codigo: 'CCC', nombre: 'Agotado', solicitado: 1, disponible: 0 }])
  })

  it('descuenta el stock de una compra posible', () => {
    descontarStock([{ codigo: 'AAA', cantidad: 4 }, { codigo: 'BBB', cantidad: 3 }])

    expect(obtenerProducto('AAA').stock).toBe(6)
    expect(obtenerProducto('BBB').stock).toBe(0)
  })

  it('no descuenta nada si un solo producto no alcanza (todo o nada)', () => {
    expect(() => descontarStock([{ codigo: 'AAA', cantidad: 1 }, { codigo: 'CCC', cantidad: 1 }]))
      .toThrowError(/Stock insuficiente para: Agotado/)
    expect(obtenerProducto('AAA').stock).toBe(10)
  })
})
