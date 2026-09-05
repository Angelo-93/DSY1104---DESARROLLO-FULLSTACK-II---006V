/**
 * INFORCORE - admin.js
 * Capa de datos compartida por todas las páginas del panel administrador.
 * Los productos y usuarios que el administrador crea, edita o elimina se
 * guardan en localStorage, en una copia separada del catálogo base
 * (PRODUCTOS) y de los usuarios semilla (USUARIOS), para no depender de
 * un servidor real.
 */

const PRODUCTOS_ADMIN_KEY = "inforcore_admin_productos";
const USUARIOS_ADMIN_KEY = "inforcore_admin_usuarios";

const CATEGORIAS_PRODUCTO = [
  "Notebooks",
  "Desktops y AIO",
  "Monitores",
  "Audio y Videoconferencia",
  "Impresión",
  "Accesorios"
];

function obtenerProductosAdmin() {
  const datos = localStorage.getItem(PRODUCTOS_ADMIN_KEY);
  if (datos) return JSON.parse(datos);
  guardarProductosAdmin(PRODUCTOS);
  return JSON.parse(JSON.stringify(PRODUCTOS));
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(lista));
}

function eliminarProductoAdmin(codigo) {
  const lista = obtenerProductosAdmin().filter((p) => p.codigo !== codigo);
  guardarProductosAdmin(lista);
}

function obtenerUsuariosAdmin() {
  const datos = localStorage.getItem(USUARIOS_ADMIN_KEY);
  if (datos) return JSON.parse(datos);
  guardarUsuariosAdmin(USUARIOS);
  return JSON.parse(JSON.stringify(USUARIOS));
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(USUARIOS_ADMIN_KEY, JSON.stringify(lista));
}

function eliminarUsuarioAdmin(run) {
  const lista = obtenerUsuariosAdmin().filter((u) => u.run !== run);
  guardarUsuariosAdmin(lista);
}

function formatearPrecioAdmin(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(valor);
}