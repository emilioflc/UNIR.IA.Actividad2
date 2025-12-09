import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const STORAGE_KEY = 'gestion-tareas-tasks'

vi.mock('../components/TaskTable', () => {
  const TaskTableMock = ({ tasks, onEdit, onDelete, onToggleCompleted }) => (
    <div data-testid="task-table-mock">
      <p data-testid="task-count">{tasks.length}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            <button type="button" data-testid={`edit-${task.id}`} onClick={() => onEdit(task)}>
              editar-mock
            </button>
            <button type="button" data-testid={`toggle-${task.id}`} onClick={() => onToggleCompleted(task.id)}>
              completar-mock
            </button>
            <button type="button" data-testid={`delete-${task.id}`} onClick={() => onDelete(task.id)}>
              eliminar-mock
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return { default: TaskTableMock }
})

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

describe('App task manager (unit)', () => {
  it('persistencia de tareas en el navegador', () => {
    const seededTasks = [
      { id: 'task-1', title: 'Persistida', description: 'Desde storage', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    expect(screen.getByText('Persistida')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(1)
  })

  it('creación y almacenamiento de tareas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /agregar tarea/i }))
    const modal = screen.getByRole('dialog')
    await user.type(within(modal).getByLabelText('Título'), 'Tarea unitaria')
    await user.type(within(modal).getByLabelText('Descripción'), 'Descripción localStorage')
    await user.click(within(modal).getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Tarea unitaria')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored.at(-1)).toMatchObject({ title: 'Tarea unitaria', description: 'Descripción localStorage' })
  })

  it('edición de tareas', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'task-edit', title: 'Editar', description: 'Original', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    await user.click(screen.getByTestId('edit-task-edit'))
    const modal = screen.getByRole('dialog')
    const titleInput = within(modal).getByLabelText('Título')
    await user.clear(titleInput)
    await user.type(titleInput, 'Editar actualizado')
    await user.click(within(modal).getByRole('button', { name: /guardar/i }))

    expect(screen.getByText('Editar actualizado')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].title).toBe('Editar actualizado')
  })

  it('completado de tareas', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'task-complete', title: 'Completar', description: '', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    await user.click(screen.getByTestId('toggle-task-complete'))
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].completed).toBe(true)
  })

  it('eliminación de tareas', async () => {
    const user = userEvent.setup()
    const seededTasks = [
      { id: 'task-delete', title: 'Eliminar', description: '', completed: false },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededTasks))

    render(<App />)

    await user.click(screen.getByTestId('delete-task-delete'))
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(0)
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument()
  })
})
