/**
 * INFORCORE - admin-inicio.js
 * Resumen mostrado en la página Home del panel administrador.
 */

function renderResumenAdmin() {
  const contenedor = document.getElementById("resumenAdmin");
  if (!contenedor) return;

  const productos = obtenerProductosAdmin();
  const usuarios = obtenerUsuariosAdmin();
  const stockBajoCount = productos.filter(
    (p) => p.stockCritico !== undefined && p.stock <= p.stockCritico
  ).length;

  contenedor.innerHTML = `
    <article>
      <h3>${productos.length}</h3>
      <p>Productos en catálogo</p>
    </article>
    <article>
      <h3>${usuarios.length}</h3>
      <p>Usuarios registrados</p>
    </article>
    <article>
      <h3>${stockBajoCount}</h3>
      <p>Productos con stock bajo</p>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", renderResumenAdmin);