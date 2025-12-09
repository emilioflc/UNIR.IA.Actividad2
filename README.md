# Gestión de tareas (React + Vite)

Aplicación web para administrar un listado de tareas con soporte para añadir, editar, eliminar, marcar como completadas y persistir la información en `localStorage`.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye npm)

## Instrucciones para ejecutar en local

1. **Instalar dependencias**

	```bash
	./scripts/setup-tests.sh
	```

	Si es la primera ejecución en tu máquina recuerda conceder permisos de ejecución: `chmod +x scripts/setup-tests.sh`. El script instala los paquetes de `npm` y descarga los navegadores necesarios para Playwright (en Linux incluye las dependencias del sistema con `--with-deps`).

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

## Pruebas automatizadas

### 1. Preparación del entorno de pruebas

Ejecuta una sola vez después de clonar el repositorio. El script instala las dependencias del proyecto, descarga los navegadores que usa Playwright y, en Linux, añade los paquetes del sistema requeridos:

```bash
./scripts/setup-tests.sh
```

Solo necesitas repetirlo si actualizas Playwright, reinstalas dependencias o cambias de máquina.

### 2. Pruebas unitarias

Verifica la lógica aislada de componentes principales, mockeando el DOM y `localStorage` con Vitest + Testing Library:

```bash
npm run test:unit
```

### 3. Pruebas de integración

Ejecuta los flujos completos dentro de la aplicación React (formularios, tabla y persistencia en `localStorage`):

```bash
npm run test:integration
```

### 4. Pruebas E2E / interfaz

Levanta automáticamente Vite y usa Playwright para interactuar con la app en un navegador real. Asegúrate de haber corrido la preparación del punto 1 antes de la primera ejecución:

```bash
npm run test:e2e
```

Los reportes HTML de Playwright se almacenan en la carpeta `playwright-report/` y pueden abrirse con `npx playwright show-report` tras una corrida.
