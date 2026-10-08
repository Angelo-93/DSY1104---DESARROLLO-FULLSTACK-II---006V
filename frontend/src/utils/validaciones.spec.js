import {
  correoTieneDominioPermitido,
  quitarError,
  tieneErrores,
  validarCampoContrasena,
  validarCampoRun,
  validarCategoria,
  validarContacto,
  validarDatosEntrega,
  validarProducto,
  validarRun,
  validarUsuario,
} from './validaciones.js'

describe('validaciones', () => {
  describe('RUN (módulo 11)', () => {
    it('acepta RUN válidos, incluido el dígito verificador K en minúscula', () => {
      expect(validarRun('182345679')).toBeTrue()
      expect(validarRun('19011029k')).toBeTrue()
    })

    it('rechaza dígito verificador incorrecto, puntos, guion y largo fuera de rango', () => {
      expect(validarRun('182345670')).toBeFalse()
      expect(validarRun('18.234.567-9')).toBeFalse()
      expect(validarRun('12345')).toBeFalse()
    })

    it('entrega el mensaje que corresponde a cada error del campo', () => {
      expect(validarCampoRun('')).toBe('El RUN es obligatorio.')
      expect(validarCampoRun('1234')).toContain('entre 7 y 9 caracteres')
      expect(validarCampoRun('182345670')).toContain('dígito verificador')
      expect(validarCampoRun('182345679')).toBe('')
    })
  })

  describe('correo y contraseña', () => {
    it('solo acepta los dominios permitidos, sin importar mayúsculas', () => {
      expect(correoTieneDominioPermitido('ana@duoc.cl')).toBeTrue()
      expect(correoTieneDominioPermitido('profe@PROFESOR.DUOC.CL')).toBeTrue()
      expect(correoTieneDominioPermitido('ana@inforcore.cl')).toBeFalse()
      expect(correoTieneDominioPermitido('@gmail.com')).toBeFalse()
    })

    it('exige contraseña de 4 a 10 caracteres (bordes incluidos)', () => {
      expect(validarCampoContrasena('abc')).not.toBe('')
      expect(validarCampoContrasena('abcd')).toBe('')
      expect(validarCampoContrasena('abcdefghij')).toBe('')
      expect(validarCampoContrasena('abcdefghijk')).not.toBe('')
    })
  })

  describe('producto', () => {
    const valido = {
      codigo: 'NB-TEST',
      nombre: 'Notebook de prueba',
      descripcion: '',
      precio: '100000',
      precioOferta: '',
      stock: '5',
      stockCritico: '',
      idCategoria: 'notebooks',
    }

    it('acepta un producto con los opcionales vacíos', () => {
      expect(tieneErrores(validarProducto(valido))).toBeFalse()
    })

    it('marca cada regla incumplida en su propio campo', () => {
      const errores = validarProducto({
        ...valido,
        codigo: 'AB',
        precio: '-1',
        stock: '2.5',
        idCategoria: '',
      })

      expect(errores.codigo).toBe('Mínimo 3 caracteres.')
      expect(errores.precio).toBe('El precio no puede ser negativo.')
      expect(errores.stock).toContain('entero')
      expect(errores.idCategoria).toBe('Selecciona una categoría.')
    })

    it('rechaza un precio de oferta igual o mayor al precio normal', () => {
      const errores = validarProducto({ ...valido, precioOferta: '100000' })
      expect(errores.precioOferta).toContain('menor que el precio normal')
    })
  })

  describe('usuario, categoría, contacto y entrega', () => {
    const usuario = {
      run: '201112222',
      nombre: 'Francisca',
      apellidos: 'Muñoz Díaz',
      correo: 'francisca.munoz@gmail.com',
      contrasena: 'cliente1',
      confirmarContrasena: 'cliente1',
      region: 'Región de Valparaíso',
      comuna: 'Viña del Mar',
      direccion: 'Av. San Martín 220',
    }

    it('acepta un registro válido y detecta contraseñas que no coinciden', () => {
      expect(tieneErrores(validarUsuario(usuario))).toBeFalse()
      const errores = validarUsuario({ ...usuario, confirmarContrasena: 'otra' })
      expect(errores.confirmarContrasena).toBe('Las contraseñas no coinciden.')
    })

    it('al editar en el admin permite dejar la contraseña vacía pero exige el rol', () => {
      const edicion = { ...usuario, contrasena: '', confirmarContrasena: undefined, tipoUsuario: '' }
      const errores = validarUsuario(edicion, { exigirContrasena: false, exigirTipo: true })

      expect(errores.contrasena).toBeUndefined()
      expect(errores.tipoUsuario).toBe('Selecciona un tipo de usuario.')
    })

    it('usa mensajes con el género y número correctos', () => {
      const errores = validarUsuario({})
      expect(errores.apellidos).toBe('Los apellidos son obligatorios.')
      expect(errores.direccion).toBe('La dirección es obligatoria.')
    })

    it('valida categoría, contacto (correo opcional) y datos de entrega', () => {
      expect(validarCategoria({ nombre: '' }).nombre).toBe('El nombre es obligatorio.')
      expect(tieneErrores(validarContacto({ nombre: 'Ana', correo: '', comentario: 'Hola' }))).toBeFalse()
      expect(validarContacto({ nombre: 'Ana', correo: 'ana@yahoo.com', comentario: 'Hola' }).correo).toContain('@duoc.cl')

      const errores = validarDatosEntrega({ nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl' })
      expect(Object.keys(errores).sort()).toEqual(['calle', 'comuna', 'region'])
    })
  })

  describe('quitarError', () => {
    it('quita solo el error del campo indicado', () => {
      expect(quitarError({ nombre: 'x', correo: 'y' }, 'nombre')).toEqual({ correo: 'y' })
    })

    it('devuelve el mismo objeto si el campo no tenía error', () => {
      const errores = { correo: 'y' }
      expect(quitarError(errores, 'nombre')).toBe(errores)
    })
  })
})
