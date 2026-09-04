/**
 * INFORCORE - validaciones.js
 * Funciones de validación reutilizadas en login, registro y contacto.
 * Debe cargarse ANTES de login.js / registro.js / contacto.js.
 */

const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

/** Revisa que el correo termine en uno de los dominios institucionales permitidos. */
function correoTieneDominioPermitido(correo) {
  const partes = correo.split("@");
  if (partes.length !== 2) return false;
  return DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase());
}

/**
 * Valida un RUN chileno sin puntos ni guion (ej: "19011022K").
 * Calcula el dígito verificador con el algoritmo módulo 11 y lo
 * compara contra el último carácter ingresado.
 */
function validarRut(rutSinFormato) {
  const rut = rutSinFormato.trim().toUpperCase();

  if (!/^[0-9]+[0-9K]$/.test(rut)) return false;
  if (rut.length < 7 || rut.length > 9) return false;

  const cuerpo = rut.slice(0, -1);
  const dvIngresado = rut.slice(-1);

  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  return dvIngresado === dvEsperado;
}

/** Escribe un mensaje de error en el <span> asociado al campo. */
function mostrarError(idSpanError, mensaje) {
  const el = document.getElementById(idSpanError);
  if (el) el.textContent = mensaje;
}

/** Limpia el mensaje de error de un campo (cuando pasa a ser válido). */
function limpiarError(idSpanError) {
  mostrarError(idSpanError, "");
}