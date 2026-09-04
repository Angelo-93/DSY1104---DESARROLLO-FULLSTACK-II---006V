/**
 * INFORCORE - registro.js
 * Validaciones del formulario de registro de usuario, según las reglas
 * de negocio del Anexo 1 (equivalentes a crear un usuario en el administrador,
 * sin el campo Tipo de Usuario que es exclusivo de la vista administrativa).
 */

function poblarSelectRegiones() {
  const selectRegion = document.getElementById("selectRegion");
  if (!selectRegion) return;

  REGIONES.forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
  });
}

function actualizarSelectComunas() {
  const selectRegion = document.getElementById("selectRegion");
  const selectComuna = document.getElementById("selectComuna");
  if (!selectRegion || !selectComuna) return;

  const region = REGIONES.find((r) => r.nombre === selectRegion.value);

  selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

  if (!region) {
    selectComuna.disabled = true;
    return;
  }

  region.comunas.forEach((comuna) => {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    selectComuna.appendChild(opcion);
  });

  selectComuna.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");
  if (!form) return;

  poblarSelectRegiones();
  document.getElementById("selectRegion").addEventListener("change", actualizarSelectComunas);

  const campoRun = document.getElementById("campoRun");
  const campoNombre = document.getElementById("campoNombreRegistro");
  const campoApellidos = document.getElementById("campoApellidos");
  const campoCorreo = document.getElementById("campoCorreoRegistro");
  const campoContrasena = document.getElementById("campoContrasenaRegistro");
  const campoConfirmar = document.getElementById("campoConfirmarContrasena");
  const selectRegion = document.getElementById("selectRegion");
  const selectComuna = document.getElementById("selectComuna");
  const campoDireccion = document.getElementById("campoDireccion");

  function validarRun() {
    const valor = campoRun.value.trim();
    if (!valor) {
      mostrarError("errorRun", "El RUN es obligatorio.");
      return false;
    }
    if (valor.length < 7 || valor.length > 9) {
      mostrarError("errorRun", "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
      return false;
    }
    if (!validarRut(valor)) {
      mostrarError("errorRun", "El RUN ingresado no es válido. Verifica el dígito verificador.");
      return false;
    }
    limpiarError("errorRun");
    return true;
  }

  function validarNombre() {
    const valor = campoNombre.value.trim();
    if (!valor) {
      mostrarError("errorNombreRegistro", "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 50) {
      mostrarError("errorNombreRegistro", "Máximo 50 caracteres.");
      return false;
    }
    limpiarError("errorNombreRegistro");
    return true;
  }

  function validarApellidos() {
    const valor = campoApellidos.value.trim();
    if (!valor) {
      mostrarError("errorApellidos", "Los apellidos son obligatorios.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorApellidos", "Máximo 100 caracteres.");
      return false;
    }
    limpiarError("errorApellidos");
    return true;
  }

  function validarCorreo() {
    const valor = campoCorreo.value.trim();
    if (!valor) {
      mostrarError("errorCorreoRegistro", "El correo es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorCorreoRegistro", "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioPermitido(valor)) {
      mostrarError("errorCorreoRegistro", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }
    limpiarError("errorCorreoRegistro");
    return true;
  }

  function validarContrasena() {
    const valor = campoContrasena.value;
    if (!valor) {
      mostrarError("errorContrasenaRegistro", "La contraseña es obligatoria.");
      return false;
    }
    if (valor.length < 4 || valor.length > 10) {
      mostrarError("errorContrasenaRegistro", "La contraseña debe tener entre 4 y 10 caracteres.");
      return false;
    }
    limpiarError("errorContrasenaRegistro");
    return true;
  }

  function validarConfirmarContrasena() {
    if (campoConfirmar.value !== campoContrasena.value || !campoConfirmar.value) {
      mostrarError("errorConfirmarContrasena", "Las contraseñas no coinciden.");
      return false;
    }
    limpiarError("errorConfirmarContrasena");
    return true;
  }

  function validarRegion() {
    if (!selectRegion.value) {
      mostrarError("errorRegion", "Selecciona una región.");
      return false;
    }
    limpiarError("errorRegion");
    return true;
  }

  function validarComuna() {
    if (!selectComuna.value) {
      mostrarError("errorComuna", "Selecciona una comuna.");
      return false;
    }
    limpiarError("errorComuna");
    return true;
  }

  function validarDireccion() {
    const valor = campoDireccion.value.trim();
    if (!valor) {
      mostrarError("errorDireccion", "La dirección es obligatoria.");
      return false;
    }
    if (valor.length > 300) {
      mostrarError("errorDireccion", "Máximo 300 caracteres.");
      return false;
    }
    limpiarError("errorDireccion");
    return true;
  }

  campoRun.addEventListener("blur", validarRun);
  campoNombre.addEventListener("blur", validarNombre);
  campoApellidos.addEventListener("blur", validarApellidos);
  campoCorreo.addEventListener("blur", validarCorreo);
  campoContrasena.addEventListener("blur", validarContrasena);
  campoConfirmar.addEventListener("blur", validarConfirmarContrasena);
  selectRegion.addEventListener("change", validarRegion);
  selectComuna.addEventListener("change", validarComuna);
  campoDireccion.addEventListener("blur", validarDireccion);

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = [
      validarRun(),
      validarNombre(),
      validarApellidos(),
      validarCorreo(),
      validarContrasena(),
      validarConfirmarContrasena(),
      validarRegion(),
      validarComuna(),
      validarDireccion()
    ];

    if (resultados.every(Boolean)) {
      document.getElementById("mensajeRegistro").textContent =
        "Registro simulado correctamente (proyecto académico, sin backend real).";
      form.reset();
      actualizarSelectComunas();
    }
  });
});