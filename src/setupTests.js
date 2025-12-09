import '@testing-library/jest-dom'

const createLocalStorageMock = () => {
  let store = {}

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = typeof value === 'string' ? value : JSON.stringify(value)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: createLocalStorageMock(),
    writable: true,
  })

  if (!globalThis.crypto) {
    globalThis.crypto = {}
  }

  if (typeof globalThis.crypto.randomUUID !== 'function') {
    globalThis.crypto.randomUUID = () => `test-id-${Math.random().toString(16).slice(2)}`
  }
})
