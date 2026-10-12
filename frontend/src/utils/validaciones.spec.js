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
      expect(validarRun('0000000')).toBeFalse() // pasaría el módulo 11, pero no es un RUN
    })

    // Caso de borde del módulo 11: cuando 11 menos el resto da 11, el verificador
    // es 0 (no "11"). Es la rama menos frecuente del cálculo.
    it('acepta un RUN cuyo dígito verificador es 0 y lo rechaza con otro dígito', () => {
      expect(validarRun('10000130')).toBeTrue()
      expect(validarRun('10000131')).toBeFalse()
    })

    it('entrega el mensaje que corresponde a cada error del campo', () => {
      expect(validarCampoRun('')).toBe('El RUN es obligatorio.')
      expect(validarCampoRun('1234')).toContain('entre 7 y 9 caracteres')
      expect(validarCampoRun('182345670')).toContain('dígito verificador')
      expect(validarCampoRun('12345678-')).toContain('sin puntos ni guion') // formato, no verificador
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

    it('exige precios enteros y un código que se pueda usar en la URL', () => {
      const errores = validarProducto({ ...valido, codigo: 'NB/01', precio: '1000.5', precioOferta: '10.5' })
      expect(errores.codigo).toContain('Solo letras, números y guiones')
      expect(errores.precio).toContain('entero')
      expect(errores.precioOferta).toContain('entero')
    })

    it('rechaza un precio de oferta igual o mayor al precio normal', () => {
      const errores = validarProducto({ ...valido, precioOferta: '100000' })
      expect(errores.precioOferta).toContain('menor que el precio normal')
    })

    it('rechaza un precio que no es número y un stock crítico negativo o con decimales', () => {
      const errores = validarProducto({ ...valido, precio: 'abc', stockCritico: '-1' })
      expect(errores.precio).toBe('El precio debe ser un número.')
      expect(errores.stockCritico).toBe('Debe ser un número entero, mínimo 0.')

      expect(validarProducto({ ...valido, stockCritico: '1.5' }).stockCritico).toBeDefined()
      // Borde: 0 es un stock crítico válido (avisa solo cuando el producto se agota).
      expect(validarProducto({ ...valido, stockCritico: '0' }).stockCritico).toBeUndefined()
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
