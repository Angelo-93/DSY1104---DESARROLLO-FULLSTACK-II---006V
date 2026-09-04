/**
 * INFORCORE - main.js
 * Funciones compartidas entre páginas: formateo de precios y
 * renderizado de tarjetas de producto. Depende de PRODUCTOS,
 * definido en js/data/productos.js (debe cargarse antes que este archivo).
 */

const CANTIDAD_DESTACADOS = 8;

/** Formatea un número como precio en pesos chilenos. */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(valor);
}

/** Construye el HTML de una tarjeta de producto. */
function crearTarjetaProducto(producto) {
  const stockBajo =
    producto.stockCritico !== undefined && producto.stock <= producto.stockCritico;

  return `
    <article class="producto-card">
      <div class="placeholder-imagen" aria-hidden="true">
        <span>${producto.categoria}</span>
      </div>

      <a href="producto-detalle.html?codigo=${encodeURIComponent(producto.codigo)}" class="producto-card__nombre">
        ${producto.nombre}
      </a>

      <p class="producto-card__specs">${producto.especificaciones}</p>

      ${stockBajo
        ? `<span class="badge-stock-critico">Stock bajo: ${producto.stock} un.</span>`
        : ""
      }

      <div class="producto-card__precio-fila">
        <span class="producto-card__precio">${formatearPrecio(producto.precio)}</span>
      </div>

      <button
        type="button"
        class="boton boton--primario boton--bloque"
        data-agregar-carrito="${producto.codigo}"
      >
        Añadir al carrito
      </button>
    </article>
  `;
}

/** Renderiza un arreglo de productos dentro del contenedor indicado. */
function renderizarGrilla(idContenedor, productos) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  if (productos.length === 0) {
    contenedor.innerHTML = `<p>No hay productos para mostrar.</p>`;
    return;
  }

  contenedor.innerHTML = productos.map(crearTarjetaProducto).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  // Home: muestra un subconjunto de productos destacados.
  if (document.getElementById("grillaDestacados")) {
    renderizarGrilla("grillaDestacados", PRODUCTOS.slice(0, CANTIDAD_DESTACADOS));
  }
});
