const request = require('supertest');
const app = require('../server'); // Importa a aplicação Express

describe('API de Tarefas', () => {
    let taskId;

    it('deve listar todas as tarefas iniciais via GET /tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0); // Baseado nos dados iniciais
    });

    it('deve criar uma nova tarefa via POST /tasks', async () => {
        const newTask = {
            title: 'Tarefa de Teste',
            description: 'Descrição da tarefa de teste'
        };
        const response = await request(app)
            .post('/tasks')
            .send(newTask);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.status).toBe('pendente');
        taskId = response.body.id; // Salva o ID para os próximos testes
    });

    it('deve atualizar o status de uma tarefa via PATCH /tasks/:id/status', async () => {
        const response = await request(app)
            .patch(`/tasks/${taskId}/status`)
            .send({ status: 'concluída' });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('concluída');
    });

    it('deve deletar uma tarefa via DELETE /tasks/:id', async () => {
        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.statusCode).toBe(204);
    });

    it('deve retornar 404 ao tentar deletar uma tarefa que não existe', async () => {
        const response = await request(app).delete('/tasks/9999');
        expect(response.statusCode).toBe(404);
    });
});
