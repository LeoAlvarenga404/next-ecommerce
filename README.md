# Next Ecommerce

Projeto full stack de e-commerce utilizando **Next.js (App Router)**, **Prisma ORM** e **PostgreSQL**.

---

## Requisitos

- [Docker + Docker Compose](https://www.docker.com/)
- [Node.js (v18+ recomendado)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou `pnpm`, `yarn`

---

## Instalação e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/LeoAlvarenga404/next-ecommerce.git
   cd next-ecommerce
   ```

2. **Suba o banco de dados com Docker Compose:**

   ```bash
   docker compose up -d
   ```

3. **Configure o arquivo `.env`:**

   ```bash
   copy .env.example .env   # Windows
   # ou
   cp .env.example .env     # Linux/Mac
   ```

   Ajuste as variáveis de ambiente se necessário.

4. **Instale as dependências:**

   ```bash
   npm install
   ```

5. **Execute o setup completo (migrations + seed):**

   ```bash
   npm run setup
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

