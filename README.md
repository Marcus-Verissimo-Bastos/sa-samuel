# Aplicativo de Avistamentos de Little Ville

Projeto final de Desenvolvimento de Sistemas Integrados. Os moradores de Little Ville se cadastram, registram avistamentos (Pé Grande e outras criaturas) e acompanham um painel com estatísticas da cidade.

- **Frontend:** React + Vite, React Router, Axios, Recharts (`/frontend`)
- **Backend:** Node.js + Express, JWT, bcrypt (`/backend`)
- **Banco:** PostgreSQL com Prisma ORM

Documentação de requisitos e regras de negócio: [`docs/DOCUMENTACAO.md`](docs/DOCUMENTACAO.md)

## Rodando localmente

Pré-requisitos: Node.js 18+ e um banco PostgreSQL (local ou um projeto gratuito no [Neon](https://neon.tech)).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # preencha DATABASE_URL, JWT_SECRET e os dados do admin
npm run db:push           # cria as tabelas
npm run db:seed           # cria o administrador e alguns avistamentos de exemplo
npm run dev               # http://localhost:3333
```

Teste rápido: `GET http://localhost:3333/api/health` deve responder `{"status":"ok"}`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3333/api
npm run dev               # http://localhost:5173
```

Entre com o admin criado pelo seed (`ADMIN_EMAIL` / `ADMIN_PASSWORD` do `.env`) ou crie uma conta de morador em **Criar conta**.

## Endpoints da API

| Método | Rota | Descrição | Acesso |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastro de morador | público |
| POST | `/api/auth/login` | Login, retorna JWT | público |
| GET | `/api/auth/me` | Usuário da sessão | logado |
| GET | `/api/sightings` | Lista com busca, filtros e paginação | logado |
| GET | `/api/sightings/:id` | Detalhe | logado |
| POST | `/api/sightings` | Cria avistamento | logado |
| PUT | `/api/sightings/:id` | Edita (dono ou admin) | logado |
| DELETE | `/api/sightings/:id` | Exclui (dono ou admin) | logado |
| GET | `/api/dashboard` | Métricas do painel | logado |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

## Deploy gratuito (Vercel + Neon)

Publique o backend e o frontend como **dois projetos** na Vercel, apontando para o mesmo repositório GitHub.

1. **Banco:** crie um projeto no Neon e copie a connection string.
2. **Backend:** na Vercel, *Add New Project*, escolha o repositório e defina **Root Directory = `backend`**. Variáveis de ambiente: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (a URL do frontend, sem barra no final). Depois do deploy, rode uma vez na sua máquina, com o `.env` apontando para o Neon: `npm run db:push && npm run db:seed`.
3. **Frontend:** novo projeto na Vercel com **Root Directory = `frontend`** (preset Vite). Variável: `VITE_API_URL=https://SEU-BACKEND.vercel.app/api`.
4. Volte no backend e atualize `CORS_ORIGIN` com a URL final do frontend, depois faça *Redeploy*.

## Segurança

- Senhas com hash **bcrypt**; nunca em texto puro.
- Segredos só em `.env` (ignorado pelo Git). Versione apenas `.env.example`.
- Se um segredo já foi commitado por engano, troque-o: apagar o arquivo do histórico não basta.
