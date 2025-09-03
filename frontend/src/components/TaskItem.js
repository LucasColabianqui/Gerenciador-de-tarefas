import React from 'react';

const TaskItem = ({ task, onUpdateStatus, onDelete }) => {
  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  return (
    <li className={`task-item status-${task.status}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div className="task-actions">
        <select value={task.status} onChange={handleStatusChange}>
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em Andamento</option>
          <option value="concluída">Concluída</option>
        </select>
        <button onClick={handleDeleteClick} className="delete-btn">Deletar</button>
      </div>
    </li>
  );
};

export default TaskItem;
