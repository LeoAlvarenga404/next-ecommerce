# Next Ecommerce

Projeto full stack de e-commerce utilizando **Next.js (App Router)**, **Prisma ORM** e **PostgreSQL**.

---

## Requisitos

- [Docker + Docker Compose](https://www.docker.com/)
- [Node.js (v18+ recomendado)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou `pnpm`, `yarn`

---

## Instalação e Execução

### 1. Clone o repositório.

```bash
git clone https://github.com/LeoAlvarenga404/nextecommerce.git
cd nextecommerce
```

### 2. Execute o Docker Compose

```bash
docker compose up -d
```

### 3. Configure o `.env`

```bash
DATABASE_URL="postgresql://postgres:123456@localhost:5432/nextecommerce"
```

### 4. Instale as dependências

```bash
npm install
# ou
pnpm install
```

### 5. Rode as migrations do Prisma

```bash
npx prisma migrate dev --name init
```

### 6. Inicie o servidor

```bash
pnpm dev
# ou
npm run dev
```
