import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES } from './almacenamiento.js'
import {
  actualizarUsuario,
  autenticarUsuario,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
  obtenerUsuario,
} from './usuariosService.js'

const ADMIN = {
  run: '182345679', nombre: 'Camila', apellidos: 'Fuentes', correo: 'camila@profesor.duoc.cl',
  contrasena: 'admin123', tipoUsuario: 'Administrador', region: 'R', comuna: 'C', direccion: 'D',
}
const CLIENTE = {
  run: '201112222', nombre: 'Francisca', apellidos: 'Muñoz', correo: 'fran@gmail.com',
  contrasena: 'cliente1', tipoUsuario: 'Cliente', region: 'R', comuna: 'C', direccion: 'D',
}

describe('usuariosService (con localStorage simulado)', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.usuarios]: [ADMIN, CLIENTE] })
  })

  it('nunca entrega la contraseña hacia la interfaz', () => {
    expect(listarUsuarios().every((u) => !('contrasena' in u))).toBeTrue()
    expect(obtenerUsuario('201112222').contrasena).toBeUndefined()
  })

  it('autentica con correo sin importar mayúsculas y contraseña exacta', () => {
    expect(autenticarUsuario('FRAN@gmail.com', 'cliente1').nombre).toBe('Francisca')
    expect(autenticarUsuario('fran@gmail.com', 'CLIENTE1')).toBeNull()
  })

  it('registra un cliente nuevo y rechaza RUN o correo repetidos', () => {
    const nuevo = crearUsuario({ ...CLIENTE, run: '156789011', correo: 'Tomas@Duoc.cl', tipoUsuario: undefined })

    expect(nuevo.tipoUsuario).toBe('Cliente')
    expect(nuevo.correo).toBe('tomas@duoc.cl')
    expect(() => crearUsuario({ ...CLIENTE, correo: 'otro@gmail.com' })).toThrowError(/RUN/)
    // RUN nuevo (y válido) pero correo ya registrado.
    expect(() => crearUsuario({ ...CLIENTE, run: '167890121' })).toThrowError(/correo/)
  })

  it('al editar con contraseña vacía conserva la anterior', () => {
    actualizarUsuario('201112222', { ...CLIENTE, nombre: 'Fran', contrasena: '' })

    const guardado = JSON.parse(memoria[CLAVES.usuarios]).find((u) => u.run === '201112222')
    expect(guardado.nombre).toBe('Fran')
    expect(guardado.contrasena).toBe('cliente1')
  })

  it('protege al único Administrador de ser eliminado o perder su rol', () => {
    expect(() => eliminarUsuario('182345679')).toThrowError(/único Administrador/)
    expect(() => actualizarUsuario('182345679', { ...ADMIN, tipoUsuario: 'Cliente' }))
      .toThrowError(/único Administrador/)

    eliminarUsuario('201112222')
    expect(obtenerUsuario('201112222')).toBeNull()
  })
})
