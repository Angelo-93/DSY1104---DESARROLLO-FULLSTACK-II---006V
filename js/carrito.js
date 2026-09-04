/**
 * INFORCORE - carrito.js
 * Carrito de compras persistido en localStorage.
 * Se incluye en TODAS las páginas (después de main.js) para que el
 * contador del header funcione en todo el sitio, y los botones
 * "Añadir al carrito" (que ya existen en el HTML con el atributo
 * data-agregar-carrito) queden conectados mediante delegación de eventos.
 */

const CARRITO_STORAGE_KEY = "inforcore_carrito";

function leerCarrito() {
  try {
    const datos = localStorage.getItem(CARRITO_STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error("No se pudo leer el carrito guardado:", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
}

function contarUnidadesCarrito(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function actualizarContadorHeader() {
  const contador = document.getElementById("contadorCarrito");
  if (!contador) return;
  contador.textContent = contarUnidadesCarrito(leerCarrito());
}

function agregarProductoAlCarrito(codigo, cantidadSolicitada = 1) {
  const producto = PRODUCTOS.find((p) => p.codigo === codigo);
  if (!producto) return;

  const carrito = leerCarrito();
  const existente = carrito.find((item) => item.codigo === codigo);
  const cantidadActual = existente ? existente.cantidad : 0;
  const cantidadFinal = Math.min(
    cantidadActual + cantidadSolicitada,
    producto.stock
  );

  if (existente) {
    existente.cantidad = cantidadFinal;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidadFinal
    });
  }

  guardarCarrito(carrito);
  actualizarContadorHeader();
  return cantidadFinal;
}

function actualizarCantidadCarrito(codigo, nuevaCantidad) {
  const producto = PRODUCTOS.find((p) => p.codigo === codigo);
  let carrito = leerCarrito();

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter((item) => item.codigo !== codigo);
  } else {
    const item = carrito.find((i) => i.codigo === codigo);
    if (item) {
      item.cantidad = producto ? Math.min(nuevaCantidad, producto.stock) : nuevaCantidad;
    }
  }

  guardarCarrito(carrito);
  actualizarContadorHeader();
  return carrito;
}

function eliminarDelCarrito(codigo) {
  const carrito = leerCarrito().filter((item) => item.codigo !== codigo);
  guardarCarrito(carrito);
  actualizarContadorHeader();
  return carrito;
}

function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function construirFilaCarrito(item) {
  return `
    <div class="carrito-fila" data-fila-codigo="${item.codigo}">
      <div class="carrito-fila__info">
        <span class="carrito-fila__nombre">${item.nombre}</span>
        <span class="carrito-fila__precio-unit">${formatearPrecio(item.precio)} c/u</span>
      </div>

      <div class="cantidad-selector cantidad-selector--compacta">
        <button type="button" class="carrito-restar" data-codigo="${item.codigo}" aria-label="Quitar una unidad">−</button>
        <span class="carrito-fila__cantidad">${item.cantidad}</span>
        <button type="button" class="carrito-sumar" data-codigo="${item.codigo}" aria-label="Agregar una unidad">+</button>
      </div>

      <span class="carrito-fila__subtotal">${formatearPrecio(item.precio * item.cantidad)}</span>

      <button type="button" class="carrito-quitar" data-codigo="${item.codigo}" aria-label="Eliminar producto del carrito">
        Eliminar
      </button>
    </div>
  `;
}

function renderizarModalCarrito() {
  const carrito = leerCarrito();
  const cuerpo = document.getElementById("carritoCuerpo");
  const totalEl = document.getElementById("carritoTotal");
  if (!cuerpo || !totalEl) return;

  if (carrito.length === 0) {
    cuerpo.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío por ahora.</p>`;
  } else {
    cuerpo.innerHTML = carrito.map(construirFilaCarrito).join("");
  }

  totalEl.textContent = formatearPrecio(calcularTotalCarrito(carrito));
}

function abrirModalCarrito() {
  const modal = document.getElementById("modalCarrito");
  if (!modal) return;
  renderizarModalCarrito();
  modal.classList.add("modal--abierto");
  document.body.classList.add("sin-scroll");
}

function cerrarModalCarrito() {
  const modal = document.getElementById("modalCarrito");
  if (!modal) return;
  modal.classList.remove("modal--abierto");
  document.body.classList.remove("sin-scroll");
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorHeader();

  document.getElementById("botonCarrito")?.addEventListener("click", abrirModalCarrito);
  document.getElementById("carritoCerrar")?.addEventListener("click", cerrarModalCarrito);
  document.getElementById("modalCarrito")?.addEventListener("click", (evento) => {
    if (evento.target.id === "modalCarrito") cerrarModalCarrito();
  });

  document.addEventListener("click", (evento) => {
    const botonAgregar = evento.target.closest("[data-agregar-carrito]");
    if (botonAgregar) {
      const codigo = botonAgregar.getAttribute("data-agregar-carrito");
      const inputCantidad = document.getElementById("inputCantidad");
      const cantidad =
        botonAgregar.id === "btnAgregarDetalle" && inputCantidad
          ? parseInt(inputCantidad.value, 10) || 1
          : 1;

      agregarProductoAlCarrito(codigo, cantidad);

      const mensaje = document.getElementById("mensajeConfirmacion");
      if (mensaje && botonAgregar.id === "btnAgregarDetalle") {
        mensaje.textContent = "Producto añadido al carrito.";
        setTimeout(() => (mensaje.textContent = ""), 2500);
      } else {
        const textoOriginal = botonAgregar.textContent;
        botonAgregar.textContent = "Añadido";
        setTimeout(() => (botonAgregar.textContent = textoOriginal), 1000);
      }
      return;
    }

    const botonSumar = evento.target.closest(".carrito-sumar");
    if (botonSumar) {
      const codigo = botonSumar.getAttribute("data-codigo");
      const carrito = leerCarrito();
      const item = carrito.find((i) => i.codigo === codigo);
      if (item) actualizarCantidadCarrito(codigo, item.cantidad + 1);
      renderizarModalCarrito();
      return;
    }

    const botonRestar = evento.target.closest(".carrito-restar");
    if (botonRestar) {
      const codigo = botonRestar.getAttribute("data-codigo");
      const carrito = leerCarrito();
      const item = carrito.find((i) => i.codigo === codigo);
      if (item) actualizarCantidadCarrito(codigo, item.cantidad - 1);
      renderizarModalCarrito();
      return;
    }

    const botonQuitar = evento.target.closest(".carrito-quitar");
    if (botonQuitar) {
      eliminarDelCarrito(botonQuitar.getAttribute("data-codigo"));
      renderizarModalCarrito();
      return;
    }

    if (evento.target.id === "carritoFinalizar") {
      const carrito = leerCarrito();
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }
      alert(
        "Compra simulada: este proyecto es una entrega académica y no procesa pagos reales."
      );
    }
  });
});