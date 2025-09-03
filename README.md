# Documentação de Arquitetura - Gerenciador de Tarefas

Este documento detalha as decisões de arquitetura, propostas de evolução e um plano de distribuição de tarefas para o projeto Gerenciador de Tarefas.

## 1. Decisões Técnicas

### Tecnologias e Frameworks

*   **Backend:**
    *   **Node.js com Express:** Escolhido pela sua simplicidade, ecossistema maduro (npm) e alta performance em operações de I/O, sendo ideal para uma API RESTful. A ausência de uma sintaxe complexa ou de um setup verboso permitiu um desenvolvimento rápido e focado na lógica de negócio.
    *   **CORS:** Middleware essencial para permitir que o frontend (servido em um domínio/porta diferente) fizesse requisições para a API sem ser bloqueado pela política de Same-Origin do navegador.

*   **Frontend:**
    *   **React:** Uma biblioteca líder de mercado para a construção de interfaces de usuário, escolhida por sua arquitetura baseada em componentes, que promove o reuso de código e a manutenibilidade. O ecossistema robusto, incluindo o Create React App, acelera o setup inicial.
    *   **Axios:** Utilizado para realizar as chamadas HTTP para o backend. É uma biblioteca mais robusta e fácil de usar do que a `fetch` API nativa, oferecendo melhor tratamento de erros e configuração de requisições.

*   **Testes:**
    *   **Jest:** Framework de testes padrão para JavaScript, integrado tanto no backend quanto no frontend (via Create React App). Foi escolhido por sua API simples, velocidade e funcionalidades completas (assertions, mocks, etc.).
    *   **Supertest:** Usado nos testes de backend para simular requisições HTTP à nossa API Express, permitindo testar os endpoints de forma programática e eficiente.
    *   **React Testing Library:** Utilizada nos testes de frontend para focar no comportamento do usuário e na acessibilidade dos componentes, garantindo que a aplicação funcione como o usuário a utilizaria.

### Estrutura de Pastas e Organização

O projeto foi dividido em duas pastas principais, `backend` e `frontend`, para uma separação clara das responsabilidades.

*   **`backend/`**
    *   `src/`: Contém todo o código-fonte da aplicação.
        *   `controllers/`: Responsável por receber as requisições HTTP, validar os dados de entrada e enviar a resposta. Atua como um intermediário entre as rotas e os serviços.
        *   `models/`: Define a estrutura de dados da nossa entidade principal (`Task`).
        *   `routes/`: Mapeia os endpoints da API (ex: `/tasks`) para os métodos correspondentes nos controladores.
        *   `services/`: Contém a lógica de negócio principal. Manipula os dados (neste caso, em memória) e é chamado pelos controladores.
        *   `__tests__/`: Contém os arquivos de teste da API.
    *   `package.json`: Define os metadados do projeto e as dependências.

*   **`frontend/`**
    *   `src/`: Contém o código-fonte do React.
        *   `components/`: Armazena componentes reutilizáveis (ex: `TaskItem.js`).
        *   `App.js`: Componente principal que orquestra a aplicação.
        *   `App.css`: Folha de estilos principal.
        *   `App.test.js`: Arquivo de teste para o componente principal.

### Estratégias de Separação de Responsabilidades

A arquitetura foi desenhada para seguir o princípio de Single Responsibility (Responsabilidade Única):

*   **Backend:** A separação em **Rotas → Controladores → Serviços → Modelos** é uma implementação da Arquitetura em Camadas (Layered Architecture) o que garante que cada camada tenha um propósito claro. As rotas lidam com o roteamento, os controladores com a interface HTTP, os serviços com a lógica de negócio e os modelos com a estrutura dos dados. Isso torna o código mais fácil de entender, manter e testar.
*   **Frontend:** A componentização no React foi a principal estratégia. A lógica de estado e as chamadas à API foram centralizadas no componente `App.js`, enquanto a responsabilidade de exibir uma única tarefa foi delegada ao componente `TaskItem.js`. Isso evita a criação de componentes monolíticos e promove o reuso.

### Funcionamento dos Testes Automatizados

*   **Testes do Backend (API):** Atuam como um cliente automatizado. Eles carregam a aplicação Express em memória e usam a biblioteca `supertest` para fazer requisições HTTP reais aos endpoints. As respostas (códigos de status e dados JSON) são então verificadas para garantir que a API se comporta conforme o esperado.

*   **Testes do Frontend (React):** Focam em testar a interface de forma isolada. Usando a `React Testing Library`, os componentes são renderizados em um DOM simulado. A parte crucial é o **mocking do `axios`**, que intercepta as chamadas de rede e retorna dados falsos pré-definidos. Isso permite verificar se a interface reage corretamente (renderiza os dados, responde a cliques) sem depender de um backend real.

---

## 2. Evolução e Escalabilidade

### Propostas de Evolução

1.  **Persistência de Dados:** A maior limitação da aplicação atual é o armazenamento de dados em memória. O próximo passo seria integrar um banco de dados. 
    *   **Sugestão:** **PostgreSQL** com um ORM como o **Sequelize** ou **Prisma**. Isso traria persistência, segurança e a capacidade de realizar consultas mais complexas.

2.  **Autenticação de Usuários:** Permitir que múltiplos usuários tenham suas próprias listas de tarefas. 
    *   **Sugestão:** Implementar autenticação via JWT (JSON Web Tokens). Novas rotas (`/auth/register`, `/auth/login`) seriam criadas, e as rotas de tarefas seriam protegidas, exigindo um token válido.

3.  **Melhorias na Interface:**
    *   **Componente de Edição:** Criar um modal ou uma view para editar todos os campos de uma tarefa, não apenas o status.
    *   **Feedback Visual:** Adicionar toasts ou snackbars para dar feedback sobre as operações (ex: "Tarefa criada com sucesso!").
    *   **Paginação/Scroll Infinito:** Para lidar com um grande número de tarefas de forma performática.

### Ganhos de Performance e Manutenção

*   **Variáveis de Ambiente:** Mover URLs da API e configurações do banco de dados para arquivos `.env` para não deixá-las hard-coded no código.
*   **Tratamento de Erros Centralizado:** No backend, criar um middleware de erro no Express para capturar todos os erros lançados na aplicação e formatar uma resposta padronizada, evitando blocos `try...catch` repetitivos nos controladores.
*   **State Management no Frontend:** Para aplicações mais complexas, o `useState` pode se tornar difícil de gerenciar. 
    *   **Sugestão:** Adotar uma biblioteca de gerenciamento de estado como **Redux Toolkit** ou **Zustand** para centralizar e facilitar o acesso e a modificação do estado global.

---

## 3. Simulação de Distribuição de Tarefas em Equipe

O desenvolvimento desta aplicação poderia ser organizado entre três desenvolvedores (Dev A, Dev B, Dev C) da seguinte forma:

### Divisão Inicial de Tarefas (Sprint 1)

*   **Dev A (Foco: Backend):**
    *   **Tarefa 1:** Estruturar o projeto Node.js/Express e configurar as pastas (controllers, services, etc.).
    *   **Tarefa 2:** Implementar o CRUD em memória para as tarefas (endpoints de criar, listar e deletar).
    *   **Tarefa 3:** Configurar o Jest e Supertest e escrever os testes de integração para os endpoints criados.

*   **Dev B (Foco: Frontend):**
    *   **Tarefa 1:** Iniciar o projeto com Create React App e limpar o template inicial.
    *   **Tarefa 2:** Implementar a funcionalidade de listar as tarefas (consumindo a API do Dev A) e criar o componente `TaskItem`.
    *   **Tarefa 3:** Implementar a funcionalidade de criar e deletar tarefas na interface.

*   **Dev C (Foco: Funcionalidades Adicionais e Qualidade):**
    *   **Tarefa 1:** Implementar a funcionalidade de atualização e filtro de status no backend.
    *   **Tarefa 2:** Implementar a interface de atualização e filtro no frontend, em colaboração com o Dev B.
    *   **Tarefa 3:** Configurar a documentação da API com Swagger e preencher a documentação inicial do projeto (`DOCUMENTACAO.md`).
    *   **Tarefa 4:** Escrever os testes de frontend com React Testing Library.

### Qualidade de Código e Colaboração

*   **Versionamento:** Utilizar um fluxo de **GitFlow** simplificado. `main` para a versão estável, `develop` para a integração contínua, e `feature/nome-da-feature` para novas implementações. Todo o trabalho é feito em *feature branches*.
*   **Revisões de Código (Pull Requests):** Nenhuma feature branch é mesclada em `develop` sem um **Pull Request (PR)**. Cada PR deve ser revisado por pelo menos um outro desenvolvedor da equipe. Isso garante a qualidade, a disseminação de conhecimento e a aderência aos padrões.
*   **Code Style e Linting:** Configurar o **ESLint** e o **Prettier** em ambos os projetos (backend e frontend). Um hook de pre-commit (com **Husky**) pode ser usado para formatar o código automaticamente antes de cada commit, garantindo um estilo de código consistente em toda a base de código.
*   **Integração Contínua (CI):** Configurar um pipeline de CI (ex: GitHub Actions) que rode os testes (`npm test`) automaticamente a cada PR. Isso impede que código com testes quebrados seja mesclado na branch principal.
