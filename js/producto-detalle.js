/**
 * INFORCORE - producto-detalle.js
 * Lee el parámetro ?codigo= de la URL, busca el producto en PRODUCTOS
 * y completa la ficha. También arma la grilla de productos relacionados
 * (misma categoría, hasta 4).
 */

function obtenerProductoPorCodigo(codigo) {
  return PRODUCTOS.find((p) => p.codigo === codigo);
}

function renderDetalle() {
  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get("codigo");
  const producto = obtenerProductoPorCodigo(codigo);

  const contenedor = document.getElementById("contenedorDetalle");

  if (!producto) {
    contenedor.innerHTML = `
      <p>No encontramos el producto solicitado.
        <a href="productos.html">Vuelve al catálogo</a>.
      </p>`;
    return;
  }

  document.title = `${producto.nombre} — INFORCORE`;

  document.getElementById("migaNombreProducto").textContent = producto.nombre;
  document
    .getElementById("detalleImagen")
    .querySelector("span").textContent = producto.categoria;
  document.getElementById("detalleCategoria").textContent = producto.categoria;
  document.getElementById("detalleNombre").textContent = producto.nombre;
  document.getElementById("detalleSpecs").textContent = producto.especificaciones;
  document.getElementById("detalleDescripcion").textContent = producto.descripcion;
  document.getElementById("detallePrecio").textContent = formatearPrecio(producto.precio);

  const stockBajo =
    producto.stockCritico !== undefined && producto.stock <= producto.stockCritico;
  document.getElementById("detalleBadgeStock").innerHTML = stockBajo
    ? `<span class="badge-stock-critico">Stock bajo: ${producto.stock} un.</span>`
    : "";

  const inputCantidad = document.getElementById("inputCantidad");
  inputCantidad.max = producto.stock;

  document
    .getElementById("btnAgregarDetalle")
    .setAttribute("data-agregar-carrito", producto.codigo);

  const relacionados = PRODUCTOS.filter(
    (p) => p.categoria === producto.categoria && p.codigo !== producto.codigo
  ).slice(0, 4);

  renderizarGrilla("grillaRelacionados", relacionados);
}

function inicializarSelectorCantidad() {
  const input = document.getElementById("inputCantidad");
  if (!input) return;

  document.getElementById("btnMenos")?.addEventListener("click", () => {
    const actual = parseInt(input.value, 10) || 1;
    input.value = Math.max(1, actual - 1);
  });

  document.getElementById("btnMas")?.addEventListener("click", () => {
    const actual = parseInt(input.value, 10) || 1;
    const maximo = parseInt(input.max, 10) || 99;
    input.value = Math.min(maximo, actual + 1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("contenedorDetalle")) return;
  renderDetalle();
  inicializarSelectorCantidad();
});
