import { useEffect, useState } from 'react'
import TaskModal from './components/TaskModal'
import TaskTable from './components/TaskTable'
import './App.css'

const STORAGE_KEY = 'gestion-tareas-tasks'

const generateTaskId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

const ensureTaskShape = (maybeTasks) => {
  if (!Array.isArray(maybeTasks)) {
    return []
  }

  return maybeTasks.map((task) => ({
    ...task,
    completed: Boolean(task?.completed),
  }))
}

function App() {
  const [tasks, setTasks] = useState(() => {
    if (typeof localStorage === 'undefined') {
      return []
    }

    try {
      const storedValue = localStorage.getItem(STORAGE_KEY)
      return storedValue ? ensureTaskShape(JSON.parse(storedValue)) : []
    } catch (error) {
      console.error('No se pudo leer el almacenamiento:', error)
      return []
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState({ title: '', description: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const openAddModal = () => {
    setFormValues({ title: '', description: '' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setFormValues({ title: task.title, description: task.description })
    setEditingId(task.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formValues.title.trim()) {
      return
    }

    setTasks((previous) => {
      if (editingId) {
        return previous.map((task) =>
          task.id === editingId ? { ...task, ...formValues } : task,
        )
      }

      return [...previous, { id: generateTaskId(), completed: false, ...formValues }]
    })

    setFormValues({ title: '', description: '' })
    closeModal()
  }

  const handleDelete = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) {
      return
    }

    const confirmationMessage = taskToDelete.title
      ? `¿Deseas eliminar la tarea "${taskToDelete.title}"?`
      : '¿Deseas eliminar esta tarea?'

    if (typeof window !== 'undefined' && !window.confirm(confirmationMessage)) {
      return
    }

    setTasks((previous) => previous.filter((task) => task.id !== id))
  }

  const handleToggleCompleted = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    )
  }

  const handleFieldChange = (field, value) => {
    setFormValues((previous) => ({ ...previous, [field]: value }))
  }

  return (
    <div className="app-shell">
      <div className="app-layout">
        <header className="app-header">
          <div>
            <p className="app-tag">Gestión de tareas sencilla</p>
            <h1 className="app-title">Lista de tareas</h1>
          </div>
          <button className="add-task-button" type="button" onClick={openAddModal}>
            Agregar Tarea
          </button>
        </header>
        <p className="app-subtitle">
          Tus tareas se guardan en el navegador para que sigas trabajando sin interrupciones.
        </p>
        <TaskTable
          tasks={tasks}
          onDelete={handleDelete}
          onEdit={openEditModal}
          onToggleCompleted={handleToggleCompleted}
        />
      </div>
      <TaskModal
        visible={isModalOpen}
        task={formValues}
        isEditing={Boolean(editingId)}
        onFieldChange={handleFieldChange}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  )
}

export default App
