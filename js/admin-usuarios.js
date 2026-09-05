/**
 * INFORCORE - admin-usuarios.js
 * Listado de usuarios del panel administrador, con acción de eliminar.
 */

function renderTablaUsuarios() {
  const usuarios = obtenerUsuariosAdmin();
  const cuerpo = document.getElementById("cuerpoTablaUsuarios");
  if (!cuerpo) return;

  if (usuarios.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="6">No hay usuarios registrados.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = usuarios
    .map((u) => {
      const claseBadge =
        u.tipoUsuario === "Administrador"
          ? "badge-rol--administrador"
          : u.tipoUsuario === "Vendedor"
          ? "badge-rol--vendedor"
          : "badge-rol--cliente";

      return `
        <tr>
          <td>${u.run}</td>
          <td>${u.nombre} ${u.apellidos}</td>
          <td>${u.correo}</td>
          <td><span class="badge-rol ${claseBadge}">${u.tipoUsuario}</span></td>
          <td>${u.region}</td>
          <td class="tabla-admin__acciones">
            <a class="boton boton--secundario boton--pequeno" href="usuario-form.html?run=${encodeURIComponent(u.run)}">Editar</a>
            <button type="button" class="boton boton--peligro boton--pequeno" data-eliminar-usuario="${u.run}">Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const cuerpo = document.getElementById("cuerpoTablaUsuarios");
  if (!cuerpo) return;

  renderTablaUsuarios();

  cuerpo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-eliminar-usuario]");
    if (!boton) return;

    const run = boton.getAttribute("data-eliminar-usuario");
    if (confirm(`¿Eliminar al usuario ${run}? Esta acción no se puede deshacer.`)) {
      eliminarUsuarioAdmin(run);
      renderTablaUsuarios();
    }
  });
});