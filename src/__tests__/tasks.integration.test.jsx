import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const STORAGE_KEY = 'gestion-tareas-tasks'

beforeEach(() => {
  localStorage.clear()
  if (!window.confirm) {
    window.confirm = () => true
  }
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Flujo completo de tareas (integración)', () => {
  it('persiste y lee tareas guardadas', () => {
    const seededTasks = [
      { id: 'integration-1', title: 'Persistencia real', description: 'Guardada antes', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    expect(screen.getByText('Persistencia real')).toBeInTheDocument()
    expect(screen.getByText('Guardada antes')).toBeInTheDocument()
  })

  it('crea y almacena una tarea usando la interfaz', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /agregar tarea/i }))
    const modal = screen.getByRole('dialog')
    await user.type(within(modal).getByLabelText('Título'), 'Integración nueva')
    await user.type(within(modal).getByLabelText('Descripción'), 'Creada desde la UI')
    await user.click(within(modal).getByRole('button', { name: /guardar/i }))

    const row = screen.getByText('Integración nueva').closest('tr')
    expect(row).toBeTruthy()
    expect(within(row).getByText('Creada desde la UI')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored.some((task) => task.title === 'Integración nueva')).toBe(true)
  })

  it('edita una tarea existente mostrando los cambios en la tabla', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'integration-edit', title: 'Editar integración', description: 'Por actualizar', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    await user.click(screen.getByRole('button', { name: /editar/i }))
    const modal = screen.getByRole('dialog')
    const titleInput = within(modal).getByLabelText('Título')
    await user.clear(titleInput)
    await user.type(titleInput, 'Editar integración completa')
    await user.click(within(modal).getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Editar integración completa')).toBeInTheDocument()
  })

  it('marca una tarea como completada y refleja el estilo correspondiente', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'integration-complete', title: 'Completar integración', description: '', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    const checkbox = screen.getByRole('checkbox', { name: /completada/i })
    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    const row = checkbox.closest('tr')
    expect(row?.classList.contains('completed-task')).toBe(true)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].completed).toBe(true)
  })

  it('elimina una tarea existente desde la tabla', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'integration-delete', title: 'Eliminar integración', description: '', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    const deleteButton = screen.getByRole('button', { name: /eliminar/i })
    await user.click(deleteButton)

    expect(screen.queryByText('Eliminar integración')).not.toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(0)
  })
})
