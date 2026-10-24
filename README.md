# 🩺 HiperCuidado — Diário Digital de Saúde

> Plataforma web responsiva (React + Node.js) que conecta pacientes e médicos no monitoramento de hipertensão e diabetes. Facilita o autocuidado com registro de métricas, gestão de medicamentos e acompanhamento clínico em tempo real.

---

## 📌 Sobre o Projeto
O **HiperCuidado** é uma aplicação web desenvolvida para otimizar o controle de condições crônicas, facilitando a adesão ao tratamento e promovendo o autocuidado por meio de duas frentes:
1. **Painel do Paciente:** Registro diário de Pressão Arterial, Glicemia e Peso, além do controle de medicamentos.
2. **Painel Clínico:** Visão consolidada para médicos gerenciarem fichas, acompanharem riscos e controlarem prescrições.

---

## ✨ Funcionalidades
* **Área do Paciente:** Registro de métricas com classificação automática (`Normal`, `Atenção`, `Crítico`), marcação de medicamentos tomados e histórico.
* **Painel Clínico:** Listagem de pacientes, visualização de riscos, adição, edição e exclusão de prescrições médicas.
* **Acessibilidade:** Suporte completo a Modo Claro e Modo Escuro (Dark Mode) e design totalmente responsivo para celulares e desktops.

---

## 🛠️ Tecnologias
* **Frontend:** React.js, CSS3 (Flexbox / Variáveis de Tema).
* **Backend:** Node.js, Express, CORS.

---

## 🚀 Como Executar
1. **Backend:** Na pasta do servidor, rode `node server.js` (porta 3001).
2. **Frontend:** Na pasta do app, rode `npm start` ou `npm run dev`.

### 🔑 Acessos de Teste
* **Paciente:** CPF `12345678900` ou EMAIL "maria@gmail.com" | Senha `123`
* **Médico:** E-mail `medico@hospital.com` | Senha `123`

---

## 🧩 Estrutura e Componentes da Aplicação

A arquitetura do frontend foi dividida em componentes modulares e responsivos para garantir uma experiência fluida e organizada:

### 1. 🎛️ `AccessibilityBar.jsx` (Barra de Acessibilidade e Tema)
* **Função:** Fica fixa no topo da aplicação.
* **Recursos:** Exibe o título do sistema e possui um menu suspenso (*dropdown*) para alternância instantânea entre **Modo Claro** e **Modo Escuro** (*Dark Mode*), com fechamento automático ao clicar fora.

### 2. 🔐 `Login.jsx` (Autenticação e Cadastro)
* **Função:** Porta de entrada para pacientes e profissionais de saúde.
* **Recursos:** Gerencia três fluxos: login de pacientes (via CPF ou e-mail), criação de nova conta (com validação de CPF de 11 dígitos, e-mail com `@`, senha e **idade livre**) e login de acesso profissional médico.

### 3. 👤 `PatientDashboard.jsx` (Painel do Paciente)
* **Função:** Central de controle diário do paciente.
* **Recursos:** Formulário para envio de novas medições (Pressão Arterial, Glicemia ou Peso) com cálculo automático de status (`Normal`, `Atenção`, `Crítico`), listagem e marcação de medicamentos tomados/pendentes, e visualização do histórico.

### 4. 🩺 `ClinicalDashboard.jsx` (Painel Clínico / Médico)
* **Função:** Espaço de acompanhamento remoto para o médico.
* **Recursos:** Listagem interativa de pacientes cadastrados, exibição de fichas detalhadas (idade, risco, e-mail) e gerenciamento completo de prescrições médicas (adicionar, **editar** e **remover** medicamentos).

### 5. 🔌 `api.js` (Serviços e Requisições)
* **Função:** Ponte de comunicação (*client*) entre o React e o servidor Node.js.
* **Recursos:** Concentra todas as chamadas HTTP (`fetch`), separando a lógica de requisições da interface de usuário.

### 6. 🎨 `index.css` (Estilos Globais e Variáveis)
* **Função:** Define a identidade visual e o design system do app.
* **Recursos:** Utiliza variáveis CSS (`:root` e `.dark-mode`) para transições suaves de tema e aplica regras globais de responsividade (*Mobile-First*).

### 7. ⚛️ `App.jsx` (Roteador Central)
* **Função:** Orquestrador principal da aplicação.
* **Recursos:** Gerencia o estado global de autenticação (verificando se o usuário é paciente, médico ou está deslogado) e controla a ativação do tema global.

### 8. 🖥️ `server.js` (Backend / API)
* **Função:** O núcleo lógico e de dados da aplicação.
* **Recursos:** Servidor Node.js + Express que gerencia o banco de dados em memória, rotas de autenticação, registro de métricas e manipulação de fichas clínicas.