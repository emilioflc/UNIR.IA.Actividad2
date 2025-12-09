# Gestión de tareas (React + Vite)

Aplicación web para administrar un listado de tareas con soporte para añadir, editar, eliminar, marcar como completadas y persistir la información en `localStorage`.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm)

## Instrucciones para ejecutar en local

1. **Instalar dependencias**

	```bash
	npm install
	```

2. **Iniciar el servidor de desarrollo**

	```bash
	npm run dev
	```

	El comando mostrará una URL (por defecto `http://localhost:5173/`). Ábrela en el navegador para usar la aplicación.

3. *(Opcional)* **Generar build de producción**

	```bash
	npm run build
	```

	El resultado quedará en la carpeta `dist/`. Puedes previsualizarlo con:

	```bash
	npm run preview
	```

## Scripts disponibles

- `npm run dev`: ejecuta Vite en modo desarrollo con recarga rápida.
- `npm run build`: genera la versión optimizada para producción.
- `npm run preview`: sirve localmente el build generado.
- `npm run lint`: ejecuta las reglas de ESLint configuradas.
