#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."
cd "${PROJECT_ROOT}"

log() {
  printf "[setup-tests] %s\n" "$1"
}

check_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: '$1' no está instalado o no se encuentra en el PATH." >&2
    exit 1
  fi
}

log "Verificando dependencias base (Node.js y npm)..."
check_command node
check_command npm

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"
log "Node.js: ${NODE_VERSION}"
log "npm: ${NPM_VERSION}"

log "Instalando dependencias del proyecto con npm install..."
npm install

log "Instalando navegadores de Playwright necesarios para pruebas end-to-end..."
PLAYWRIGHT_ARGS=(install)
UNAME_OUT="$(uname -s | tr '[:upper:]' '[:lower:]')"
if [[ "${UNAME_OUT}" == linux* ]]; then
  # En Linux se necesitan dependencias del sistema.
  PLAYWRIGHT_ARGS+=(--with-deps)
fi
npx playwright "${PLAYWRIGHT_ARGS[@]}"

log "Entorno listo. Usa 'npm run test:unit', 'npm run test:integration' o 'npm run test:e2e' según corresponda."
