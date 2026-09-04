/**
 * INFORCORE - contacto.js
 * Validaciones del formulario de contacto. Según el Anexo 1, el correo
 * es el único campo que no está marcado como obligatorio (solo tiene
 * restricción de largo y dominio si se completa).
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  if (!form) return;

  const campoNombre = document.getElementById("campoNombreContacto");
  const campoCorreo = document.getElementById("campoCorreoContacto");
  const campoComentario = document.getElementById("campoComentario");

  function validarNombre() {
    const valor = campoNombre.value.trim();
    if (!valor) {
      mostrarError("errorNombreContacto", "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorNombreContacto", "Máximo 100 caracteres.");
      return false;
    }
    limpiarError("errorNombreContacto");
    return true;
  }

  function validarCorreo() {
    const valor = campoCorreo.value.trim();

    if (!valor) {
      limpiarError("errorCorreoContacto");
      return true; // Este campo no es obligatorio.
    }
    if (valor.length > 100) {
      mostrarError("errorCorreoContacto", "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioPermitido(valor)) {
      mostrarError("errorCorreoContacto", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }

    limpiarError("errorCorreoContacto");
    return true;
  }

  function validarComentario() {
    const valor = campoComentario.value.trim();
    if (!valor) {
      mostrarError("errorComentario", "El comentario es obligatorio.");
      return false;
    }
    if (valor.length > 500) {
      mostrarError("errorComentario", "Máximo 500 caracteres.");
      return false;
    }
    limpiarError("errorComentario");
    return true;
  }

  campoNombre.addEventListener("blur", validarNombre);
  campoCorreo.addEventListener("blur", validarCorreo);
  campoComentario.addEventListener("blur", validarComentario);

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const comentarioValido = validarComentario();

    if (nombreValido && correoValido && comentarioValido) {
      document.getElementById("mensajeContacto").textContent =
        "Mensaje enviado correctamente (proyecto académico, sin backend real).";
      form.reset();
    }
  });
});