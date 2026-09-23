# Documentação: Aplicativo de Avistamentos de Little Ville

## 1. Visão geral

Aplicação web responsiva para que moradores de Little Ville registrem e consultem avistamentos do Pé Grande e de outras criaturas, com um painel de estatísticas para a cidade.

**Arquitetura em três camadas:** frontend React (Vite) → API REST Node/Express → PostgreSQL via Prisma. Autenticação por JWT.

## 2. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | O visitante pode se cadastrar informando nome, e-mail e senha. |
| RF02 | O morador cadastrado pode fazer login com e-mail e senha. |
| RF03 | Apenas usuários autenticados acessam painel e avistamentos; os demais são redirecionados ao login. |
| RF04 | O morador pode registrar um avistamento (título, tipo de criatura, data e hora, local, descrição). |
| RF05 | O morador pode listar avistamentos com busca por texto, filtro por criatura e situação, opção "só os meus" e paginação. |
| RF06 | O morador pode ver o detalhe de qualquer avistamento. |
| RF07 | O morador pode editar e excluir seus próprios avistamentos. |
| RF08 | O administrador pode editar e excluir qualquer avistamento e alterar sua situação (Em análise, Confirmado, Descartado). |
| RF09 | O painel exibe totais (registros, últimos 7 dias, confirmados, em análise, moradores), avistamentos por mês, situação dos relatos, tipos de criatura, locais mais citados e os 5 avistamentos mais recentes. |
| RF10 | O usuário pode encerrar a sessão (logout). |

## 3. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | **Responsividade:** interface adaptada a smartphones, tablets e desktops. |
| RNF02 | **Segurança:** senhas com hash bcrypt; tokens JWT assinados com segredo em variável de ambiente; cabeçalhos de segurança via Helmet; CORS restrito às origens configuradas. |
| RNF03 | **Configuração segura:** credenciais apenas em `.env`, fora do repositório. |
| RNF04 | **API RESTful** em JSON, com códigos HTTP adequados (400, 401, 403, 404, 409, 500). |
| RNF05 | **Separação de camadas:** frontend e backend em pastas independentes. |
| RNF06 | **Usabilidade:** mensagens de erro claras, confirmação antes de excluir, estados vazios com ação sugerida. |
| RNF07 | **Disponibilidade:** aplicação publicada em plataforma gratuita (Vercel) com URL pública. |

## 4. Regras de negócio

| ID | Regra |
|---|---|
| RN01 | O e-mail é único; cadastro com e-mail existente é recusado (409). |
| RN02 | A senha tem no mínimo 6 caracteres. |
| RN03 | Todo novo usuário é criado como **MORADOR**. O perfil **ADMIN** só é criado pelo seed. |
| RN04 | O título tem no mínimo 3 caracteres e a descrição no mínimo 10. |
| RN05 | O tipo de criatura deve estar na lista: Pé Grande, Lobisomem, Criatura aquática, Luzes misteriosas, Chupa-cabra, Outro. |
| RN06 | A data do avistamento não pode estar no futuro. |
| RN07 | Todo avistamento novo nasce como **Em análise** (PENDENTE). |
| RN08 | Somente o autor ou um ADMIN pode editar/excluir um avistamento; somente ADMIN altera a situação. |
| RN09 | Ao excluir um usuário, seus avistamentos são excluídos (cascade). |
| RN10 | O token JWT expira em 7 dias (configurável) e a sessão expirada leva ao login. |

## 5. Modelo de dados

- **User**: `id`, `name`, `email` (único), `passwordHash`, `role` (MORADOR | ADMIN), `createdAt`
- **Sighting**: `id`, `title`, `description`, `creature`, `location`, `sightedAt`, `status` (PENDENTE | CONFIRMADO | DESCARTADO), `userId` (FK → User), `createdAt`, `updatedAt`

Relação: um User possui vários Sightings (1:N).

## 6. Stack

React 18, Vite, React Router, Axios, Recharts · Node.js, Express, jsonwebtoken, bcryptjs, Helmet, CORS · PostgreSQL (Neon), Prisma · Git/GitHub, Vercel.
