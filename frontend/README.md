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
├── styles/          identidad visual de INFORCORE sobre Bootstrap
├── App.jsx          mapa de rutas
└── main.jsx         punto de entrada
```

Cada componente tiene su prueba al lado, con el mismo nombre y extensión `.spec.jsx`.

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
