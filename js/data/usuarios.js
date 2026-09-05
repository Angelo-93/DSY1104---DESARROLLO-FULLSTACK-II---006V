/**
 * INFORCORE - Usuarios semilla del sistema
 * Arreglo en memoria que representa a los usuarios existentes.
 * El panel administrador guarda sus propios cambios en localStorage,
 * usando este arreglo solo como punto de partida.
 */

const USUARIOS = [
  {
    run: "182345679",
    nombre: "Camila",
    apellidos: "Fuentes Rojas",
    correo: "camila.fuentes@inforcore.cl",
    fechaNacimiento: "1990-04-12",
    tipoUsuario: "Administrador",
    region: "Región Metropolitana de Santiago",
    comuna: "Providencia",
    direccion: "Av. Holanda 099, Of. 1101"
  },
  {
    run: "167890121",
    nombre: "Matías",
    apellidos: "Soto Lagos",
    correo: "matias.soto@inforcore.cl",
    fechaNacimiento: "1995-08-23",
    tipoUsuario: "Vendedor",
    region: "Región Metropolitana de Santiago",
    comuna: "Ñuñoa",
    direccion: "Los Leones 456"
  },
  {
    run: "201112222",
    nombre: "Francisca",
    apellidos: "Muñoz Díaz",
    correo: "francisca.munoz@gmail.com",
    fechaNacimiento: "2001-01-30",
    tipoUsuario: "Cliente",
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Av. San Martín 220"
  },
  {
    run: "156789011",
    nombre: "Tomás",
    apellidos: "Herrera Vidal",
    correo: "tomas.herrera@duoc.cl",
    fechaNacimiento: "",
    tipoUsuario: "Cliente",
    region: "Región del Biobío",
    comuna: "Concepción",
    direccion: "Barros Arana 890"
  }
];