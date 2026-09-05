/**
 * INFORCORE - admin-usuario-form.js
 * Formulario único para crear y editar usuarios. El modo se determina
 * por la presencia de ?run= en la URL. Incluye el campo Tipo de Usuario,
 * exclusivo de la vista administrativa según el Anexo 1.
 */

function poblarSelectRegionesAdmin() {
  const select = document.getElementById("selectRegionAdmin");
  if (!select) return;

  REGIONES.forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    select.appendChild(opcion);
  });
}

function actualizarSelectComunasAdmin() {
  const selectRegion = document.getElementById("selectRegionAdmin");
  const selectComuna = document.getElementById("selectComunaAdmin");
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
  const form = document.getElementById("formUsuarioAdmin");
  if (!form) return;

  poblarSelectRegionesAdmin();
  document
    .getElementById("selectRegionAdmin")
    .addEventListener("change", actualizarSelectComunasAdmin);

  const parametros = new URLSearchParams(window.location.search);
  const runEdicion = parametros.get("run");
  const esEdicion = Boolean(runEdicion);

  const campoRun = document.getElementById("campoRunAdmin");
  const campoNombre = document.getElementById("campoNombreAdmin");
  const campoApellidos = document.getElementById("campoApellidosAdmin");
  const campoCorreo = document.getElementById("campoCorreoAdmin");
  const campoFechaNacimiento = document.getElementById("campoFechaNacimientoAdmin");
  const campoTipoUsuario = document.getElementById("campoTipoUsuario");
  const selectRegion = document.getElementById("selectRegionAdmin");
  const selectComuna = document.getElementById("selectComunaAdmin");
  const campoDireccion = document.getElementById("campoDireccionAdmin");

  document.getElementById("tituloFormUsuario").textContent = esEdicion
    ? "Editar usuario"
    : "Nuevo usuario";

  if (esEdicion) {
    const usuarios = obtenerUsuariosAdmin();
    const usuario = usuarios.find((u) => u.run === runEdicion);

    if (!usuario) {
      form.innerHTML = `<p>No se encontró el usuario ${runEdicion}. <a href="usuarios.html">Volver al listado</a>.</p>`;
      return;
    }

    campoRun.value = usuario.run;
    campoRun.readOnly = true;
    campoNombre.value = usuario.nombre;
    campoApellidos.value = usuario.apellidos;
    campoCorreo.value = usuario.correo;
    campoFechaNacimiento.value = usuario.fechaNacimiento || "";
    campoTipoUsuario.value = usuario.tipoUsuario;
    selectRegion.value = usuario.region;
    actualizarSelectComunasAdmin();
    selectComuna.value = usuario.comuna;
    campoDireccion.value = usuario.direccion;
  }

  function validarRun() {
    const valor = campoRun.value.trim();
    if (!valor) {
      mostrarError("errorRunAdmin", "El RUN es obligatorio.");
      return false;
    }
    if (valor.length < 7 || valor.length > 9) {
      mostrarError("errorRunAdmin", "Debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
      return false;
    }
    if (!validarRut(valor)) {
      mostrarError("errorRunAdmin", "El RUN no es válido. Verifica el dígito verificador.");
      return false;
    }
    if (!esEdicion && obtenerUsuariosAdmin().some((u) => u.run === valor)) {
      mostrarError("errorRunAdmin", "Ya existe un usuario con ese RUN.");
      return false;
    }
    limpiarError("errorRunAdmin");
    return true;
  }

  function validarNombre() {
    const valor = campoNombre.value.trim();
    if (!valor) {
      mostrarError("errorNombreAdmin", "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 50) {
      mostrarError("errorNombreAdmin", "Máximo 50 caracteres.");
      return false;
    }
    limpiarError("errorNombreAdmin");
    return true;
  }

  function validarApellidos() {
    const valor = campoApellidos.value.trim();
    if (!valor) {
      mostrarError("errorApellidosAdmin", "Los apellidos son obligatorios.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorApellidosAdmin", "Máximo 100 caracteres.");
      return false;
    }
    limpiarError("errorApellidosAdmin");
    return true;
  }

  function validarCorreo() {
    const valor = campoCorreo.value.trim();
    if (!valor) {
      mostrarError("errorCorreoAdmin", "El correo es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorCorreoAdmin", "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioPermitido(valor)) {
      mostrarError("errorCorreoAdmin", "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }
    limpiarError("errorCorreoAdmin");
    return true;
  }

  function validarTipoUsuario() {
    if (!campoTipoUsuario.value) {
      mostrarError("errorTipoUsuario", "Selecciona un tipo de usuario.");
      return false;
    }
    limpiarError("errorTipoUsuario");
    return true;
  }

  function validarRegion() {
    if (!selectRegion.value) {
      mostrarError("errorRegionAdmin", "Selecciona una región.");
      return false;
    }
    limpiarError("errorRegionAdmin");
    return true;
  }

  function validarComuna() {
    if (!selectComuna.value) {
      mostrarError("errorComunaAdmin", "Selecciona una comuna.");
      return false;
    }
    limpiarError("errorComunaAdmin");
    return true;
  }

  function validarDireccion() {
    const valor = campoDireccion.value.trim();
    if (!valor) {
      mostrarError("errorDireccionAdmin", "La dirección es obligatoria.");
      return false;
    }
    if (valor.length > 300) {
      mostrarError("errorDireccionAdmin", "Máximo 300 caracteres.");
      return false;
    }
    limpiarError("errorDireccionAdmin");
    return true;
  }

  campoRun.addEventListener("blur", validarRun);
  campoNombre.addEventListener("blur", validarNombre);
  campoApellidos.addEventListener("blur", validarApellidos);
  campoCorreo.addEventListener("blur", validarCorreo);
  campoTipoUsuario.addEventListener("change", validarTipoUsuario);
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
      validarTipoUsuario(),
      validarRegion(),
      validarComuna(),
      validarDireccion()
    ];

    if (!resultados.every(Boolean)) return;

    const usuarioGuardado = {
      run: campoRun.value.trim(),
      nombre: campoNombre.value.trim(),
      apellidos: campoApellidos.value.trim(),
      correo: campoCorreo.value.trim(),
      fechaNacimiento: campoFechaNacimiento.value,
      tipoUsuario: campoTipoUsuario.value,
      region: selectRegion.value,
      comuna: selectComuna.value,
      direccion: campoDireccion.value.trim()
    };

    const lista = obtenerUsuariosAdmin();
    if (esEdicion) {
      const indice = lista.findIndex((u) => u.run === runEdicion);
      lista[indice] = usuarioGuardado;
    } else {
      lista.push(usuarioGuardado);
    }
    guardarUsuariosAdmin(lista);
    window.location.href = "usuarios.html";
  });
});