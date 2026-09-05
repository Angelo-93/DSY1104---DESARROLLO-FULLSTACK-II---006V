/**
 * INFORCORE - admin-producto-form.js
 * Formulario único para crear y editar productos (según el Anexo 1,
 * "Nuevo Producto o Editar producto" comparten la misma vista).
 * El modo se determina por la presencia de ?codigo= en la URL.
 */

function poblarSelectCategorias() {
  const select = document.getElementById("campoCategoria");
  if (!select) return;

  CATEGORIAS_PRODUCTO.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProducto");
  if (!form) return;

  poblarSelectCategorias();

  const parametros = new URLSearchParams(window.location.search);
  const codigoEdicion = parametros.get("codigo");
  const esEdicion = Boolean(codigoEdicion);

  const campoCodigo = document.getElementById("campoCodigo");
  const campoNombre = document.getElementById("campoNombreProducto");
  const campoDescripcion = document.getElementById("campoDescripcion");
  const campoPrecio = document.getElementById("campoPrecio");
  const campoStock = document.getElementById("campoStock");
  const campoStockCritico = document.getElementById("campoStockCritico");
  const campoCategoria = document.getElementById("campoCategoria");
  const campoImagen = document.getElementById("campoImagen");

  document.getElementById("tituloFormProducto").textContent = esEdicion
    ? "Editar producto"
    : "Nuevo producto";

  let productoOriginal = null;

  if (esEdicion) {
    const productos = obtenerProductosAdmin();
    productoOriginal = productos.find((p) => p.codigo === codigoEdicion);

    if (!productoOriginal) {
      form.innerHTML = `<p>No se encontró el producto ${codigoEdicion}. <a href="productos.html">Volver al listado</a>.</p>`;
      return;
    }

    campoCodigo.value = productoOriginal.codigo;
    campoCodigo.readOnly = true;
    campoNombre.value = productoOriginal.nombre;
    campoDescripcion.value = productoOriginal.descripcion || "";
    campoPrecio.value = productoOriginal.precio;
    campoStock.value = productoOriginal.stock;
    campoStockCritico.value =
      productoOriginal.stockCritico === undefined ? "" : productoOriginal.stockCritico;
    campoCategoria.value = productoOriginal.categoria;
    campoImagen.value = productoOriginal.imagen || "";
  }

  function validarCodigo() {
    const valor = campoCodigo.value.trim();
    if (!valor) {
      mostrarError("errorCodigo", "El código es obligatorio.");
      return false;
    }
    if (valor.length < 3) {
      mostrarError("errorCodigo", "Mínimo 3 caracteres.");
      return false;
    }
    if (!esEdicion && obtenerProductosAdmin().some((p) => p.codigo === valor)) {
      mostrarError("errorCodigo", "Ya existe un producto con ese código.");
      return false;
    }
    limpiarError("errorCodigo");
    return true;
  }

  function validarNombre() {
    const valor = campoNombre.value.trim();
    if (!valor) {
      mostrarError("errorNombreProducto", "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError("errorNombreProducto", "Máximo 100 caracteres.");
      return false;
    }
    limpiarError("errorNombreProducto");
    return true;
  }

  function validarDescripcion() {
    const valor = campoDescripcion.value.trim();
    if (valor.length > 500) {
      mostrarError("errorDescripcion", "Máximo 500 caracteres.");
      return false;
    }
    limpiarError("errorDescripcion");
    return true;
  }

  function validarPrecio() {
    const valor = campoPrecio.value;
    if (valor === "") {
      mostrarError("errorPrecio", "El precio es obligatorio.");
      return false;
    }
    const numero = Number(valor);
    if (Number.isNaN(numero) || numero < 0) {
      mostrarError("errorPrecio", "El precio no puede ser negativo.");
      return false;
    }
    limpiarError("errorPrecio");
    return true;
  }

  function validarStock() {
    const valor = campoStock.value;
    if (valor === "") {
      mostrarError("errorStock", "El stock es obligatorio.");
      return false;
    }
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) {
      mostrarError("errorStock", "El stock debe ser un número entero, mínimo 0.");
      return false;
    }
    limpiarError("errorStock");
    return true;
  }

  function validarStockCritico() {
    const valor = campoStockCritico.value;
    if (valor === "") {
      limpiarError("errorStockCritico");
      return true;
    }
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) {
      mostrarError("errorStockCritico", "Debe ser un número entero, mínimo 0.");
      return false;
    }
    limpiarError("errorStockCritico");
    return true;
  }

  function validarCategoria() {
    if (!campoCategoria.value) {
      mostrarError("errorCategoria", "Selecciona una categoría.");
      return false;
    }
    limpiarError("errorCategoria");
    return true;
  }

  campoCodigo.addEventListener("blur", validarCodigo);
  campoNombre.addEventListener("blur", validarNombre);
  campoDescripcion.addEventListener("blur", validarDescripcion);
  campoPrecio.addEventListener("blur", validarPrecio);
  campoStock.addEventListener("blur", validarStock);
  campoStockCritico.addEventListener("blur", validarStockCritico);
  campoCategoria.addEventListener("change", validarCategoria);

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = [
      validarCodigo(),
      validarNombre(),
      validarDescripcion(),
      validarPrecio(),
      validarStock(),
      validarStockCritico(),
      validarCategoria()
    ];

    if (!resultados.every(Boolean)) return;

    const productoGuardado = {
      codigo: campoCodigo.value.trim(),
      nombre: campoNombre.value.trim(),
      descripcion: campoDescripcion.value.trim(),
      categoria: campoCategoria.value,
      precio: Number(campoPrecio.value),
      stock: Number(campoStock.value),
      stockCritico: campoStockCritico.value === "" ? undefined : Number(campoStockCritico.value),
      especificaciones: productoOriginal ? productoOriginal.especificaciones : "",
      imagen: campoImagen.value.trim()
    };

    const lista = obtenerProductosAdmin();
    if (esEdicion) {
      const indice = lista.findIndex((p) => p.codigo === codigoEdicion);
      lista[indice] = productoGuardado;
    } else {
      lista.push(productoGuardado);
    }
    guardarProductosAdmin(lista);
    window.location.href = "productos.html";
  });
});