export default function TaskModal({
  visible,
  task = { title: '', description: '' },
  onFieldChange,
  onSave,
  onClose,
  isEditing,
}) {
  if (!visible) {
    return null
  }

  const isFormValid = task.title.trim().length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isFormValid) {
      return
    }

    onSave()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Editar tarea' : 'Agregar tarea'}
      >
        <h2>{isEditing ? 'Editar tarea' : 'Agregar tarea'}</h2>
        <p className="modal-subtitle">Ingresa los datos para poder guardar la tarea.</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input
              type="text"
              value={task.title}
              onChange={(event) => onFieldChange('title', event.target.value)}
              placeholder="Escribe un título..."
              required
            />
          </label>
          <label>
            <span>Descripción</span>
            <textarea
              value={task.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
              placeholder="Escribe una descripción opcional..."
              rows={3}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={!isFormValid}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
