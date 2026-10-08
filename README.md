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

La versión entregada en la **EP1** (HTML5, CSS3 y JavaScript vanilla) queda conservada
en la etiqueta Git [`ep1-entrega`](../../tree/ep1-entrega).

## Cómo ejecutar el frontend

Requisitos: Node.js 22 o superior.

```bash
cd frontend
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm test         # pruebas unitarias con Karma + Jasmine e informe de cobertura
```

El detalle técnico está en [`frontend/README.md`](frontend/README.md).
