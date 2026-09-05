/**
 * INFORCORE - admin-productos.js
 * Listado de productos del panel administrador, con acción de eliminar.
 */

function renderTablaProductos() {
  const productos = obtenerProductosAdmin();
  const cuerpo = document.getElementById("cuerpoTablaProductos");
  if (!cuerpo) return;

  if (productos.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="6">No hay productos registrados.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = productos
    .map((p) => {
      const stockBajo = p.stockCritico !== undefined && p.stock <= p.stockCritico;
      return `
        <tr>
          <td>${p.codigo}</td>
          <td>${p.nombre}</td>
          <td>${p.categoria}</td>
          <td>${formatearPrecioAdmin(p.precio)}</td>
          <td>${p.stock}${stockBajo ? ' <span class="badge-stock-critico">Bajo</span>' : ""}</td>
          <td class="tabla-admin__acciones">
            <a class="boton boton--secundario boton--pequeno" href="producto-form.html?codigo=${encodeURIComponent(p.codigo)}">Editar</a>
            <button type="button" class="boton boton--peligro boton--pequeno" data-eliminar-producto="${p.codigo}">Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const cuerpo = document.getElementById("cuerpoTablaProductos");
  if (!cuerpo) return;

  renderTablaProductos();

  cuerpo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-eliminar-producto]");
    if (!boton) return;

    const codigo = boton.getAttribute("data-eliminar-producto");
    if (confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) {
      eliminarProductoAdmin(codigo);
      renderTablaProductos();
    }
  });
});