import editIconUrl from '../assets/edit.svg'
import trashIconUrl from '../assets/trash.svg'

const IconImage = ({ src, alt }) => (
  <img src={src} alt={alt} className="icon" draggable="false" />
)

export default function TaskTable({ tasks, onEdit, onDelete, onToggleCompleted }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Aún no hay tareas registradas.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th className="status-header" aria-label="Estado">&nbsp;</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.completed ? 'completed-task' : ''}>
              <td className="status-cell">
                <input
                  type="checkbox"
                  aria-label={`Marcar ${task.title} como ${task.completed ? 'incompleta' : 'completada'}`}
                  checked={task.completed}
                  onChange={() => onToggleCompleted(task.id)}
                />
              </td>
              <td className="task-title-cell">{task.title}</td>
              <td className="task-desc-cell">
                {task.description ? (
                  task.description
                ) : (
                  <span className="muted">Sin descripción</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onEdit(task)}
                  >
                    <IconImage src={editIconUrl} alt="Editar" />
                  </button>
                  <button
                    type="button"
                    className="icon-button danger"
                    onClick={() => onDelete(task.id)}
                  >
                    <IconImage src={trashIconUrl} alt="Eliminar" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
