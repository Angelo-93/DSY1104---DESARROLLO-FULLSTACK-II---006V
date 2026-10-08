# INFORCORE — Frontend (EP2)

Aplicación de una sola página (SPA) en React para la tienda INFORCORE.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| Vite 8 | Crea y compila el proyecto (alternativa a create-react-app aceptada por el docente) |
| React 19 | Componentes funcionales con hooks |
| React Bootstrap + Bootstrap 5.3 | Componentes visuales y diseño responsivo |
| React Router (`react-router-dom` 7) | Navegación entre vistas sin recargar la página |
| Karma + Jasmine | Ejecución y escritura de pruebas unitarias |
| React Testing Library | Renderizar componentes y simular acciones del usuario en las pruebas |

## Estructura de `src/` (Atomic Design)

```
src/
├── components/
│   ├── atoms/       piezas mínimas (marca)
│   ├── molecules/   combinaciones simples de átomos (desde el Bloque 4)
│   ├── organisms/   bloques completos (menú, pie de página, menú del admin)
│   └── templates/   esqueletos de página (tienda y panel admin)
├── pages/           vistas completas, una por ruta
├── data/            datos semilla: productos, categorías, usuarios, órdenes, regiones
├── services/        CRUD sobre localStorage (la "base de datos simulada")
├── utils/           funciones puras: validaciones, cálculos, formato de precios y fechas
├── testing/         mocks para las pruebas (no forman parte de la app)
├── styles/          identidad visual de INFORCORE sobre Bootstrap
├── App.jsx          mapa de rutas
└── main.jsx         punto de entrada
```

Cada archivo tiene su prueba al lado, con el mismo nombre y extensión `.spec.js` o `.spec.jsx`.
Los `import` de archivos propios llevan la extensión (`./App.jsx`): el proyecto usa módulos ES
(`"type": "module"`), y así lo exige webpack al compilar las pruebas.

## Datos y persistencia

No hay backend en la EP2: los servicios de `src/services` leen y escriben en `localStorage`.
La primera vez copian los datos semilla de `src/data`; desde ahí, todo cambio queda guardado
en el navegador. Para volver a los datos iniciales, borra las claves desde DevTools
(pestaña Application > Local Storage).

| Clave | Contenido |
| --- | --- |
| `inforcore_productos` | Catálogo (lo comparten la tienda y el admin) |
| `inforcore_categorias` | Categorías editables |
| `inforcore_usuarios` | Usuarios registrados |
| `inforcore_ordenes` | Órdenes de compra (boletas) |
| `inforcore_carrito` | Carrito del visitante |
| `inforcore_sesion` | Usuario con sesión iniciada |

## Usuarios de prueba

Datos ficticios. Las contraseñas están en texto plano porque es una simulación sin backend;
la autenticación segura corresponde a la EP3.

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | camila.fuentes@profesor.duoc.cl | admin123 |
| Vendedor | matias.soto@duoc.cl | vende123 |
| Cliente | francisca.munoz@gmail.com | cliente1 |
| Cliente | tomas.herrera@duoc.cl | cliente2 |

## Comandos

```bash
npm install              # instala dependencias
npm run dev              # servidor de desarrollo (http://localhost:5173)
npm run build            # compila para producción en dist/
npm test                 # pruebas en Chrome sin ventana + informe en coverage/index.html
npm run test:watch       # pruebas en Chrome visible, se repiten al guardar
npm run test:navegadores # pruebas en Chrome, Firefox y Edge
npm run lint             # revisión estática del código con oxlint
```

La cobertura mínima exigida es 60% (umbral indicado por el docente); bajo ese valor `npm test` falla.
