# NotalyX — Frontend

Interface web do **NotalyX**, sistema de controle de notas acadêmicas. Permite criar conta, cadastrar matérias, lançar notas por unidade e acompanhar em tempo real se a meta de aprovação está sendo atingida.

🔗 Aplicação em produção: [notalyx.vercel.app](https://notalyx.vercel.app/)
🔗 Repositório do backend: [notalyx-backend](https://github.com/eulskkj/notalyx-backend)

> **Aviso:** o backend roda em plano gratuito (Render) e "dorme" quando fica sem uso. No primeiro acesso, o login pode levar até 1 minuto. Se demorar, é só aguardar e tentar de novo.

## Funcionalidades

- Cadastro e login de usuário
- CRUD de matérias por usuário
- Lançamento de notas por unidade
- Configuração personalizada: número de unidades, nota máxima e meta de média
- Acompanhamento da situação em cada matéria (meta atingida ou não)

## Stack

- React 19
- React Router DOM 7
- Vite
- ESLint
- Deploy na Vercel (o `vercel.json` redireciona todas as rotas para o `index.html`, necessário para o React Router)

## Estrutura

```
src/
├── components/
│   └── Header.jsx
├── pages/
│   ├── login/Login.jsx
│   ├── registro/Registro.jsx
│   ├── cadastroMaterias/CadastroMaterias.jsx
│   └── listaMaterias/ListaMaterias.jsx
├── Api.jsx        # chamadas à API (fetch)
├── App.jsx        # rotas
├── main.jsx
└── style.css
```

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/eulskkj/notalyx-frontend.git
cd notalyx-frontend

# 2. Instale as dependências
npm install

# 3. Rode em modo desenvolvimento
npm run dev
```

O app sobe em `http://localhost:5173`.

| Comando           | Descrição                |
|-------------------|--------------------------|
| `npm run dev`     | Servidor de desenvolvimento |
| `npm run build`   | Gera a build de produção |
| `npm run preview` | Pré-visualiza a build    |
| `npm run lint`    | Roda o ESLint            |

### Apontando para outra API

A URL da API fica no topo de `src/Api.jsx`:

```js
const API = 'https://notalyx-backend.onrender.com/api'
```

Para usar o backend local, troque por `http://localhost:5000/api`.

## Backend

A API é feita em Flask + MySQL e fica em outro repositório: [notalyx-backend](https://github.com/eulskkj/notalyx-backend). Lá estão a documentação das rotas e as instruções para rodar.

## Autor

Desenvolvido por [Luis](https://github.com/eulskkj), estudante de Desenvolvimento de Sistemas.
