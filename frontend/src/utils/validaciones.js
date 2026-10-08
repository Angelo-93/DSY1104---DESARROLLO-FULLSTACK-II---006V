/**
 * Validaciones de INFORCORE, reutilizadas por todos los formularios (registro,
 * login, contacto, checkout y los mantenedores del admin). Reglas tomadas del
 * Anexo 1 de la EP1 y de los mensajes que ya usaba la versión HTML.
 *
 * Convención: cada validador de formulario devuelve un objeto de errores
 * { campo: 'mensaje' }. Si el objeto está vacío, los datos son válidos. Así el
 * formulario puede mostrar cada mensaje bajo su campo con un solo llamado.
 *
 * Son funciones puras: no tocan el DOM ni localStorage, por eso se prueban
 * directamente y las comparten la tienda y el admin.
 */

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export const TIPOS_USUARIO = ['Administrador', 'Vendedor', 'Cliente']

const MENSAJE_DOMINIO = 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'

/* ---------- Reglas base ---------- */

/**
 * Valida un RUN chileno sin puntos ni guion (ej: "19011029K") con el algoritmo
 * módulo 11: cada dígito del cuerpo, de derecha a izquierda, se multiplica por
 * 2, 3, 4, 5, 6, 7, 2, 3...; el dígito verificador sale de 11 menos el resto
 * de dividir la suma por 11 (11 → "0", 10 → "K").
 *
 * @param {string} runSinFormato
 * @returns {boolean}
 */
export function validarRun(runSinFormato) {
  const run = String(runSinFormato ?? '').trim().toUpperCase()

  if (!/^[0-9]+[0-9K]$/.test(run)) return false
  if (run.length < 7 || run.length > 9) return false

  const cuerpo = run.slice(0, -1)
  const dvIngresado = run.slice(-1)

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  let dvEsperado
  if (resto === 11) dvEsperado = '0'
  else if (resto === 10) dvEsperado = 'K'
  else dvEsperado = String(resto)

  return dvIngresado === dvEsperado
}

/**
 * @param {string} correo
 * @returns {boolean} true si el dominio está en DOMINIOS_PERMITIDOS.
 */
export function correoTieneDominioPermitido(correo) {
  const partes = String(correo ?? '').trim().split('@')
  if (partes.length !== 2 || partes[0] === '') return false
  return DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase())
}

/**
 * @param {object} errores - Resultado de cualquier validador de formulario.
 * @returns {boolean}
 */
export function tieneErrores(errores) {
  return Object.keys(errores).length > 0
}

/**
 * Quita el error de un campo cuando el usuario lo vuelve a escribir: si no,
 * el mensaje rojo seguiría ahí aunque el campo ya esté corregido, hasta el
 * próximo envío. Se usa en los formularios como setErrores((e) => quitarError(e, campo)).
 *
 * @param {object} errores
 * @param {string} campo
 * @returns {object} Los errores sin ese campo (el mismo objeto si no tenía error,
 *   así React no vuelve a dibujar el formulario sin necesidad).
 */
export function quitarError(errores, campo) {
  if (!(campo in errores)) return errores
  const { [campo]: _quitado, ...resto } = errores
  return resto
}

/* ---------- Validadores de un campo (devuelven '' si el valor es válido) ---------- */

/**
 * Texto con largo máximo. Es obligatorio solo si se entrega "siVacio": el mensaje
 * va completo y no armado con plantilla, porque en español cambia con el género
 * y el número ("El nombre es obligatorio", "Los apellidos son obligatorios").
 *
 * @param {string} valor
 * @param {{maximo: number, siVacio?: string}} reglas
 * @returns {string}
 */
export function validarTexto(valor, { maximo, siVacio }) {
  const texto = String(valor ?? '').trim()
  if (!texto) return siVacio ?? ''
  if (texto.length > maximo) return `Máximo ${maximo} caracteres.`
  return ''
}

/** @returns {string} Mensaje de error del RUN, o '' si es válido. */
export function validarCampoRun(valor) {
  const run = String(valor ?? '').trim()
  if (!run) return 'El RUN es obligatorio.'
  if (run.length < 7 || run.length > 9) return 'Debe tener entre 7 y 9 caracteres, sin puntos ni guion.'
  if (!validarRun(run)) return 'El RUN no es válido. Verifica el dígito verificador.'
  return ''
}

/**
 * @param {string} valor
 * @param {{obligatorio?: boolean}} [opciones] - El correo es opcional en Contacto.
 * @returns {string}
 */
export function validarCampoCorreo(valor, { obligatorio = true } = {}) {
  const correo = String(valor ?? '').trim()
  if (!correo) return obligatorio ? 'El correo es obligatorio.' : ''
  if (correo.length > 100) return 'Máximo 100 caracteres.'
  if (!correoTieneDominioPermitido(correo)) return MENSAJE_DOMINIO
  return ''
}

/** @returns {string} Mensaje de error de la contraseña (4 a 10 caracteres), o ''. */
export function validarCampoContrasena(valor) {
  const contrasena = String(valor ?? '')
  if (!contrasena) return 'La contraseña es obligatoria.'
  if (contrasena.length < 4 || contrasena.length > 10) {
    return 'La contraseña debe tener entre 4 y 10 caracteres.'
  }
  return ''
}

/* ---------- Ayudantes internos ---------- */

// Los formularios entregan texto ("12", ""); estos ayudantes interpretan ese
// texto como número sin confundir "vacío" con "cero".
function estaVacio(valor) {
  return valor === null || valor === undefined || String(valor).trim() === ''
}

function esEnteroNoNegativo(valor) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero >= 0
}

// Agrega el mensaje al objeto de errores solo si hay mensaje.
function anotar(errores, campo, mensaje) {
  if (mensaje) errores[campo] = mensaje
}

/* ---------- Validadores de formulario completo ---------- */

/**
 * Reglas de producto (Anexo 1 EP1): código mín. 3, nombre máx. 100, descripción
 * opcional máx. 500, precio mín. 0, stock entero mín. 0, stock crítico opcional,
 * categoría obligatoria. Nuevo en la EP2: precio de oferta opcional y menor al
 * precio, y especificaciones opcionales (máx. 200, la línea corta de la tarjeta).
 *
 * @param {object} datos - Valores del formulario de producto.
 * @returns {object} Errores por campo.
 */
export function validarProducto(datos) {
  const errores = {}

  const codigo = String(datos.codigo ?? '').trim()
  if (!codigo) errores.codigo = 'El código es obligatorio.'
  else if (codigo.length < 3) errores.codigo = 'Mínimo 3 caracteres.'

  anotar(errores, 'nombre', validarTexto(datos.nombre, { maximo: 100, siVacio: 'El nombre es obligatorio.' }))
  anotar(errores, 'especificaciones', validarTexto(datos.especificaciones, { maximo: 200 }))
  anotar(errores, 'descripcion', validarTexto(datos.descripcion, { maximo: 500 }))

  if (estaVacio(datos.precio)) errores.precio = 'El precio es obligatorio.'
  else if (Number.isNaN(Number(datos.precio))) errores.precio = 'El precio debe ser un número.'
  else if (Number(datos.precio) < 0) errores.precio = 'El precio no puede ser negativo.'

  if (!estaVacio(datos.precioOferta)) {
    const oferta = Number(datos.precioOferta)
    if (Number.isNaN(oferta) || oferta < 0) errores.precioOferta = 'Debe ser un número, mínimo 0.'
    else if (!errores.precio && oferta >= Number(datos.precio)) {
      errores.precioOferta = 'El precio de oferta debe ser menor que el precio normal.'
    }
  }

  if (estaVacio(datos.stock)) errores.stock = 'El stock es obligatorio.'
  else if (!esEnteroNoNegativo(datos.stock)) errores.stock = 'El stock debe ser un número entero, mínimo 0.'

  if (!estaVacio(datos.stockCritico) && !esEnteroNoNegativo(datos.stockCritico)) {
    errores.stockCritico = 'Debe ser un número entero, mínimo 0.'
  }

  if (estaVacio(datos.idCategoria)) errores.idCategoria = 'Selecciona una categoría.'

  return errores
}

/**
 * @param {{nombre: string, descripcion?: string}} datos
 * @returns {object} Errores por campo.
 */
export function validarCategoria(datos) {
  const errores = {}
  anotar(errores, 'nombre', validarTexto(datos.nombre, { maximo: 50, siVacio: 'El nombre es obligatorio.' }))
  anotar(errores, 'descripcion', validarTexto(datos.descripcion, { maximo: 200 }))
  return errores
}

/**
 * Reglas de usuario, compartidas por el registro de la tienda y el mantenedor
 * del admin.
 *
 * @param {object} datos - Valores del formulario de usuario.
 * @param {object} [opciones]
 * @param {boolean} [opciones.exigirContrasena=true] - false al editar un usuario
 *   en el admin: la contraseña vacía significa "no cambiarla".
 * @param {boolean} [opciones.exigirTipo=false] - true en el admin, donde se elige el rol.
 * @returns {object} Errores por campo.
 */
export function validarUsuario(datos, { exigirContrasena = true, exigirTipo = false } = {}) {
  const errores = {}

  anotar(errores, 'run', validarCampoRun(datos.run))
  anotar(errores, 'nombre', validarTexto(datos.nombre, { maximo: 50, siVacio: 'El nombre es obligatorio.' }))
  anotar(errores, 'apellidos', validarTexto(datos.apellidos, { maximo: 100, siVacio: 'Los apellidos son obligatorios.' }))
  anotar(errores, 'correo', validarCampoCorreo(datos.correo))

  const contrasenaVacia = !datos.contrasena
  if (exigirContrasena || !contrasenaVacia) {
    anotar(errores, 'contrasena', validarCampoContrasena(datos.contrasena))
  }
  // Solo se compara si el formulario trae el campo de confirmación (registro).
  if (datos.confirmarContrasena !== undefined && datos.confirmarContrasena !== datos.contrasena) {
    errores.confirmarContrasena = 'Las contraseñas no coinciden.'
  }

  if (exigirTipo && !TIPOS_USUARIO.includes(datos.tipoUsuario)) {
    errores.tipoUsuario = 'Selecciona un tipo de usuario.'
  }
  if (estaVacio(datos.region)) errores.region = 'Selecciona una región.'
  if (estaVacio(datos.comuna)) errores.comuna = 'Selecciona una comuna.'
  anotar(errores, 'direccion', validarTexto(datos.direccion, { maximo: 300, siVacio: 'La dirección es obligatoria.' }))

  return errores
}

/**
 * Formulario de contacto (EP1): nombre obligatorio máx. 100, correo OPCIONAL
 * (si se escribe, debe tener dominio permitido) y comentario obligatorio máx. 500.
 *
 * @returns {object} Errores por campo.
 */
export function validarContacto(datos) {
  const errores = {}
  anotar(errores, 'nombre', validarTexto(datos.nombre, { maximo: 100, siVacio: 'El nombre es obligatorio.' }))
  anotar(errores, 'correo', validarCampoCorreo(datos.correo, { obligatorio: false }))
  anotar(errores, 'comentario', validarTexto(datos.comentario, { maximo: 500, siVacio: 'El comentario es obligatorio.' }))
  return errores
}

/**
 * Datos del cliente y dirección de entrega del checkout (Anexo 1 EP2, Figura 6).
 * Departamento e indicaciones son opcionales, como en el diseño propuesto.
 *
 * @returns {object} Errores por campo.
 */
export function validarDatosEntrega(datos) {
  const errores = {}
  anotar(errores, 'nombre', validarTexto(datos.nombre, { maximo: 50, siVacio: 'El nombre es obligatorio.' }))
  anotar(errores, 'apellidos', validarTexto(datos.apellidos, { maximo: 100, siVacio: 'Los apellidos son obligatorios.' }))
  anotar(errores, 'correo', validarCampoCorreo(datos.correo))
  anotar(errores, 'calle', validarTexto(datos.calle, { maximo: 300, siVacio: 'La calle es obligatoria.' }))
  anotar(errores, 'departamento', validarTexto(datos.departamento, { maximo: 50 }))
  if (estaVacio(datos.region)) errores.region = 'Selecciona una región.'
  if (estaVacio(datos.comuna)) errores.comuna = 'Selecciona una comuna.'
  anotar(errores, 'indicaciones', validarTexto(datos.indicaciones, { maximo: 300 }))
  return errores
}
