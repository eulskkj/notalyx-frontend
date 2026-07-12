# NotalyX — Frontend

Interface web do **NotalyX**, sistema de controle de notas acadêmicas. Permite criar conta, cadastrar matérias, lançar notas por unidade e acompanhar em tempo real se a meta de aprovação está sendo atingida.

🔗 Aplicação em produção: [notalyx.vercel.app](https://notalyx.vercel.app/)
🔗 Repositório do backend: [notalyx-backend](https://github.com/eulskkj/notalyx-backend)

## Stack

- **React** — biblioteca de interface
- **React Router** — navegação entre páginas (login, registro, cadastro de matérias, painel de notas)
- **CSS puro** — estilização
- **Vercel** — hospedagem

## Funcionalidades

- Cadastro e login de usuário
- Configuração escolar personalizável (número de unidades, meta total de aprovação, nota máxima por unidade)
- Cadastro de matérias com notas por unidade
- Painel com cálculo automático de:
  - Média atual
  - Quanto falta, em média, para bater a meta nas unidades restantes
  - Status da matéria (Aprovado / Atenção / Crítico)
- Edição e remoção de matérias já cadastradas
- Validação de notas: bloqueia entrada de valores fora do intervalo permitido (0 até a nota máxima configurada)

## Estrutura do projeto

```
src/
├── pages/
│   ├── login/            # Tela de login
│   ├── registro/         # Tela de criação de conta
│   ├── cadastroMaterias/ # Configuração escolar + cadastro de matérias
│   └── listaMaterias/    # Painel com todas as matérias e notas
├── components/
│   └── Header.jsx        # Cabeçalho com dados do usuário logado
├── Api.jsx                # Comunicação com o backend + funções de cálculo
├── App.jsx                # Rotas e estado global (usuário, configuração)
└── style.css               # Estilos da aplicação
```

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/eulskkj/notalyx-frontend.git
cd notalyx-frontend

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

> A aplicação está configurada para consumir a API em produção (`notalyx-backend.onrender.com`). Para apontar para um backend local, ajuste a constante `API` em `src/Api.jsx`.

## Backend

Este frontend consome a API REST do [notalyx-backend](https://github.com/eulskkj/notalyx-backend), feita em Flask + MySQL, com autenticação via hash de senha e hospedada no Render.

## Autor

Desenvolvido por [Luis](https://github.com/eulskkj) — estudante de Desenvolvimento de Sistemas, focado em back-end.
