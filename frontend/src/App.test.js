import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Simula o módulo axios
jest.mock('axios');

const mockTasks = [
  { id: 1, title: 'Tarefa Mock 1', description: 'Descrição 1', status: 'pendente' },
  { id: 2, title: 'Tarefa Mock 2', description: 'Descrição 2', status: 'concluída' },
];

describe('Testes do Frontend - Gerenciador de Tarefas', () => {

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    axios.get.mockClear();
    axios.post.mockClear();
    axios.patch.mockClear();
    axios.delete.mockClear();
  });

  test('deve renderizar o título e buscar as tarefas iniciais', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<App />);
    
    // Verifica se o título principal está na tela
    expect(screen.getByText(/Gerenciador de Tarefas/i)).toBeInTheDocument();

    // Espera que as tarefas mockadas apareçam na tela
    const task1 = await screen.findByText('Tarefa Mock 1');
    const task2 = await screen.findByText('Tarefa Mock 2');

    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();

    // Verifica se o axios.get foi chamado corretamente
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/tasks', { params: {} });
  });

  test('deve permitir a exclusão de uma tarefa', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });
    axios.delete.mockResolvedValueOnce({}); // Mock da resposta do delete

    render(<App />);

    // Espera que os itens sejam carregados
    await screen.findByText('Tarefa Mock 1');

    // Encontra todos os botões de deletar e clica no primeiro
    const deleteButtons = screen.getAllByText(/Deletar/i);
    fireEvent.click(deleteButtons[0]);

    // Espera que a função de delete do axios seja chamada com o ID correto
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/tasks/1');
    });
  });

  test('deve permitir a criação de uma nova tarefa', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTasks });
    const newTask = { id: 3, title: 'Nova Tarefa Criada', description: '', status: 'pendente' };
    axios.post.mockResolvedValueOnce({ data: newTask });

    render(<App />);
    await screen.findByText('Tarefa Mock 1');

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText(/Título da tarefa/i), {
      target: { value: 'Nova Tarefa Criada' },
    });

    // Clica no botão de adicionar
    fireEvent.click(screen.getByText(/Adicionar Tarefa/i));

    // Espera que a função de post do axios seja chamada com os dados corretos
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/tasks', {
        title: 'Nova Tarefa Criada',
        description: '',
        status: 'pendente',
      });
    });
  });
});