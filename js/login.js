/**
 * INFORCORE - login.js
 * Validaciones del formulario de inicio de sesión, según reglas del Anexo 1:
 * correo requerido (máx. 100, dominios permitidos) y contraseña requerida (4-10 caracteres).
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  if (!form) return;

  const campoCorreo = document.getElementById("campoCorreo");
  const campoContrasena = document.getElementById("campoContrasena");

  function validarCorreo() {
    const valor = campoCorreo.value.trim();

    if (!valor) {
      mostrarError("errorCorreo", "El correo es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorCorreo", "El correo no puede superar los 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioPermitido(valor)) {
      mostrarError("errorCorreo", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }

    limpiarError("errorCorreo");
    return true;
  }

  function validarContrasena() {
    const valor = campoContrasena.value;

    if (!valor) {
      mostrarError("errorContrasena", "La contraseña es obligatoria.");
      return false;
    }
    if (valor.length < 4 || valor.length > 10) {
      mostrarError("errorContrasena", "La contraseña debe tener entre 4 y 10 caracteres.");
      return false;
    }

    limpiarError("errorContrasena");
    return true;
  }

  campoCorreo.addEventListener("blur", validarCorreo);
  campoContrasena.addEventListener("blur", validarContrasena);

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const correoValido = validarCorreo();
    const contrasenaValida = validarContrasena();

    if (correoValido && contrasenaValida) {
      document.getElementById("mensajeLogin").textContent =
        "Inicio de sesión simulado correctamente (proyecto académico, sin backend real).";
    }
  });
});