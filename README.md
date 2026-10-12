# INFORCORE — Tienda Online

Proyecto transversal de la asignatura **DSY1104 Desarrollo Fullstack II** (Duoc UC, sede Maipú, sección 006V).
Tienda online de hardware corporativo y educacional, desarrollada en tres evaluaciones parciales.

**Autor:** Angelo Pastene — Grupo 1 (individual, autorizado por el docente).
**Docente:** Daniel Antonio Vega Vargas.

## Estructura del repositorio

| Carpeta | Contenido | Evaluación |
| --- | --- | --- |
| `frontend/` | Aplicación React + Bootstrap con pruebas Jasmine/Karma | EP2 |
| `backend/` | API REST con base de datos (se agrega en la EP3) | EP3 |

La versión final de la **EP1** (HTML5, CSS3 y JavaScript vanilla) queda conservada en la
etiqueta Git [`ep1-entrega`](../../tree/ep1-entrega). Incluye una corrección menor hecha después
de la entrega (`producto-detalle.html`, commit `dc04afe`); el commit anterior, `6193f74`, es la
versión tal como se entregó.

## Cómo ejecutar el frontend

Requisitos: Node.js 22 (desde la 22.18) o Node.js 24 o posterior (desde la 24.11), las versiones
que exige Babel 8, y Google Chrome para ejecutar las pruebas. `npm run test:navegadores` necesita
además Firefox y Edge.

```bash
cd frontend
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm test         # pruebas unitarias con Karma + Jasmine e informe de cobertura
```

El detalle técnico está en [`frontend/README.md`](frontend/README.md).
