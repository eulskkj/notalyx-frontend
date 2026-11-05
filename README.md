# NotalyX

Sistema web de **controle de notas acadêmicas**. Permite criar conta, cadastrar matérias, lançar notas por unidade e acompanhar em tempo real se a meta de aprovação está sendo atingida.

🔗 Aplicação em produção: [notalyx.vercel.app](https://notalyx.vercel.app/)

> **Aviso:** o backend roda em plano gratuito (Render) e "dorme" após um período sem uso. A primeira requisição pode demorar ou falhar; basta aguardar e tentar de novo.

## Funcionalidades

- Cadastro e login de usuário
- CRUD de matérias por usuário
- Lançamento de notas por unidade
- Configuração personalizada: número de unidades, nota máxima e meta de média
- Acompanhamento da situação em cada matéria (meta atingida ou não)

## Stack

**Frontend (este repositório)**

- React 19
- React Router DOM 7
- Vite
- ESLint
- Deploy na Vercel (`vercel.json` redireciona todas as rotas para o `index.html`)

**Backend (repositório separado)**

- Python 3 + Flask (API REST)
- MySQL (Aiven) via `mysql-connector-python`
- Werkzeug (hash de senha)
- Flask-CORS
- Gunicorn
- Deploy no Render

## Estrutura do frontend

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

Outros scripts:

| Comando           | Descrição                         |
|-------------------|-----------------------------------|
| `npm run build`   | Gera a build de produção          |
| `npm run preview` | Pré-visualiza a build             |
| `npm run lint`    | Roda o ESLint                     |

### Apontando para outra API

A URL da API fica no topo de `src/Api.jsx`:

```js
const API = 'https://notalyx-backend.onrender.com/api'
```

Para usar um backend local, troque por `http://localhost:5000/api`.

## API (backend)

| Método | Rota                       | Descrição                           |
|--------|----------------------------|-------------------------------------|
| POST   | `/api/registrar`           | Cria uma nova conta                 |
| POST   | `/api/login`               | Autentica o usuário                 |
| GET    | `/api/materias/<username>` | Lista as matérias do usuário        |
| POST   | `/api/materias`            | Cria uma nova matéria               |
| PUT    | `/api/materias/<id>`       | Atualiza as notas de uma matéria    |
| DELETE | `/api/materias/<id>`       | Remove uma matéria                  |
| GET    | `/api/config/<username>`   | Retorna as configurações do usuário |
| PUT    | `/api/config/<username>`   | Salva as configurações do usuário   |

### Banco de dados

MySQL com as tabelas `usuarios`, `materias` e `configuracoes`. As notas de cada matéria são armazenadas como JSON.

### Variáveis de ambiente do backend

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL_CA`

### Rodando o backend localmente

```bash
cd BACKEND
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# defina as variáveis de ambiente acima apontando para seu MySQL
python app.py
```

O servidor sobe em `http://localhost:5000`.

## Segurança

- Senhas armazenadas com hash (`werkzeug.security`), nunca em texto puro
- Credenciais do banco ficam em variáveis de ambiente, fora do código-fonte

## Autor

Desenvolvido por [Luis](https://github.com/eulskkj), estudante de Desenvolvimento de Sistemas.
