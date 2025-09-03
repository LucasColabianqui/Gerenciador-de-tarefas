import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskItem from './components/TaskItem';

// Define a URL base da API usando a variável de ambiente, com um fallback para o ambiente local.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const fetchTasks = async () => {
    try {
      const params = filterStatus === 'todas' ? {} : { status: filterStatus };
      const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
      setTasks(response.data);
    } catch (err) {
      setError('Não foi possível carregar as tarefas. O backend está em execução?');
      console.error(err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle) {
      alert('O título é obrigatório.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/tasks`, {
        title: newTitle,
        description: newDescription,
        status: 'pendente'
      });
      setNewTitle('');
      setNewDescription('');
      fetchTasks();
    } catch (err) {
      setError('Não foi possível criar a tarefa.');
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (err) {
      setError('Não foi possível atualizar o status da tarefa.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Não foi possível deletar a tarefa.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gerenciador de Tarefas</h1>
      </header>
      <main>
        <div className="add-task-form">
          <h2>Criar Nova Tarefa</h2>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button type="submit">Adicionar Tarefa</button>
          </form>
        </div>

        {error && <p className="error">{error}</p>}
        
        <div className="task-list">
          <div className="filter-container">
            <span>Filtrar por:</span>
            <button onClick={() => setFilterStatus('todas')} className={filterStatus === 'todas' ? 'active' : ''}>Todas</button>
            <button onClick={() => setFilterStatus('pendente')} className={filterStatus === 'pendente' ? 'active' : ''}>Pendente</button>
            <button onClick={() => setFilterStatus('em andamento')} className={filterStatus === 'em andamento' ? 'active' : ''}>Em Andamento</button>
            <button onClick={() => setFilterStatus('concluída')} className={filterStatus === 'concluída' ? 'active' : ''}>Concluída</button>
          </div>
          <h2>Tarefas</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateTaskStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          ) : (
            <p>Nenhuma tarefa encontrada para este filtro.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;