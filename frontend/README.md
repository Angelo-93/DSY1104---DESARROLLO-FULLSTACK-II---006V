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
| react-confetti | Animación de celebración al confirmar una compra (vista en la clase del 15-09) |
| Chart.js + react-chartjs-2 | Gráficos de la vista Reportes del panel (vista en la clase del 15-09) |

## Estructura de `src/` (Atomic Design)

```
src/
├── components/
│   ├── atoms/       piezas mínimas (marca)
│   ├── molecules/   combinaciones simples de átomos (desde el Bloque 4)
│   ├── organisms/   bloques completos (menú, pie de página, menú del admin)
│   └── templates/   esqueletos de página (tienda y panel admin)
├── pages/           vistas completas, una por ruta
├── context/         estado compartido (sesión y carrito) con Context de React
├── hooks/           useSesion, useCarrito y useCerrarSesion para leer ese estado
├── routing/         RutaProtegida: acceso al panel según el rol
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

## Panel administrador

| Sección | Administrador | Vendedor |
| --- | --- | --- |
| Dashboard, Órdenes y Boleta | Sí | Sí (solo lectura) |
| Productos y Productos críticos | Crear, editar, eliminar | Solo lectura |
| Categorías, Usuarios (con historial) y Reportes | Sí | No |
| Perfil | Sí | Sí |

La vista Reportes se carga bajo demanda (`React.lazy`): Chart.js solo se descarga cuando un
Administrador abre esa vista, no cuando un cliente visita la tienda.

## Simulación del pago

La EP2 no tiene pasarela de pago. El checkout rechaza el pago en dos casos:

- **Real:** algún producto ya no tiene stock suficiente al momento de pagar.
- **Simulado:** el selector "Simulación del medio de pago" del checkout permite elegir
  aprobar o rechazar, para mostrar ambos resultados en la presentación.

Las órdenes rechazadas también se guardan (con su motivo) y no descuentan stock.

## Usuarios de prueba

Datos ficticios. Las contraseñas están en texto plano porque es una simulación sin backend;
la autenticación segura corresponde a la EP3.

Administrador: acceso total al panel. Vendedor: solo consulta productos y órdenes.
Cliente: solo la tienda.

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
npm run test:rubrica     # solo las 10 pruebas marcadas para la rúbrica, con su nombre
npm run test:watch       # pruebas en Chrome visible, se repiten al guardar
npm run test:navegadores # pruebas en Chrome, Firefox y Edge
npm run lint             # revisión estática del código con oxlint
```

La cobertura mínima exigida es 60% (umbral indicado por el docente); bajo ese valor `npm test` falla.

## Pruebas

Hay pruebas para componentes, páginas, hooks, servicios y funciones de `utils`. Cada una está
junto al archivo que prueba. Las herramientas son Karma (ejecuta las pruebas en Chrome),
Jasmine (`describe`, `it`, `expect`, mocks) y React Testing Library (dibuja el componente y
simula al usuario).

Diez pruebas de componentes están marcadas con `[Rúbrica N/10 · Tipo]` en su nombre y con un
comentario que explica qué verifican. Cubren los cinco tipos que propone el docente en el
Anexo 1, dos por tipo. `npm run test:rubrica` ejecuta solo esas diez y muestra su nombre.

| N° | Tipo | Componente | Qué verifica | Mock |
| --- | --- | --- | --- | --- |
| 1 | Renderizado | `GrillaProductos` | Una tarjeta por cada producto del conjunto de datos | — |
| 2 | Renderizado | `TablaCarrito` | Una fila por línea, con precios y subtotal formateados | — |
| 3 | Renderizado condicional | `CampoFormulario` | El error aparece solo cuando existe | — |
| 4 | Renderizado condicional | `CelebracionCompra` | Sin confeti si el sistema pide reducir animaciones | `spyOn(window, 'matchMedia')` |
| 5 | Props | `ModalConfirmacion` | Usa el título y la etiqueta recibidos y llama a la función de cada botón | `jasmine.createSpy` |
| 6 | Props | `TarjetaProducto` | Muestra los datos del producto recibido y enlaza a su detalle | — |
| 7 | Estado | `FormularioLogin` | El estado de cada campo cambia al escribir | — |
| 8 | Estado | `FormularioContacto` | El contador de caracteres sigue al estado del mensaje | — |
| 9 | Eventos | `SelectorCantidad` | Los clics en + y − avisan la cantidad nueva | `jasmine.createSpy` |
| 10 | Eventos | `PaginaDetalleProducto` | Dos clics agregan la cantidad elegida al carrito y lo guardan | localStorage falso |

Mocks usados en el proyecto (carpeta `src/testing/` y Jasmine):

- **localStorage falso** (`instalarLocalStorageFalso`): reemplaza el almacenamiento del navegador
  por un objeto en memoria. Cada prueba parte con los datos que necesita y no toca los datos
  reales. Es el equivalente al mock de una API, porque localStorage es la base de datos simulada.
- **`jasmine.createSpy`**: función falsa que registra si la llamaron y con qué datos. Prueba que un
  componente avisa a su padre (props `onAgregar`, `onConfirmar`...).
- **`spyOn`**: reemplaza por un rato una función existente (`window.matchMedia`, `window.print`).
  Jasmine restaura la original al terminar cada prueba.
- **`jasmine.clock().mockDate`**: fija la fecha actual para que las órdenes creadas en las pruebas
  tengan siempre la misma fecha.

