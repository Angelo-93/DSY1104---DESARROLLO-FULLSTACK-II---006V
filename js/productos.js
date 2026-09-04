/**
 * INFORCORE - productos.js
 * Lógica exclusiva de la página productos.html: filtro por categoría
 * y buscador por nombre sobre el arreglo PRODUCTOS.
 */

function obtenerCategorias(productos) {
  return [...new Set(productos.map((p) => p.categoria))].sort();
}

function poblarFiltroCategorias() {
  const select = document.getElementById("filtroCategoria");
  if (!select) return;

  obtenerCategorias(PRODUCTOS).forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

function aplicarFiltros() {
  const categoria = document.getElementById("filtroCategoria")?.value ?? "";
  const texto = (document.getElementById("buscadorProducto")?.value ?? "")
    .trim()
    .toLowerCase();

  const resultado = PRODUCTOS.filter((producto) => {
    const coincideCategoria = !categoria || producto.categoria === categoria;
    const coincideTexto =
      !texto || producto.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  renderizarGrilla("grillaProductos", resultado);

  const contador = document.getElementById("contadorResultados");
  if (contador) {
    contador.textContent = `${resultado.length} producto${resultado.length === 1 ? "" : "s"}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("grillaProductos")) return;

  poblarFiltroCategorias();

  // Si se llega desde un enlace tipo productos.html?categoria=Notebooks,
  // preselecciona el filtro correspondiente.
  const parametros = new URLSearchParams(window.location.search);
  const categoriaInicial = parametros.get("categoria");
  if (categoriaInicial) {
    const select = document.getElementById("filtroCategoria");
    if (select) select.value = categoriaInicial;
  }

  document
    .getElementById("filtroCategoria")
    ?.addEventListener("change", aplicarFiltros);
  document
    .getElementById("buscadorProducto")
    ?.addEventListener("input", aplicarFiltros);

  aplicarFiltros();
});
