const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.category.createMany({
    data: [
      { name: "Camisas" },
      { name: "Calças" },
      { name: "Tênis" },
      { name: "Bermudas" },
    ],
  });
  console.log("Categorias criadas");

  const categories = await prisma.category.findMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Camisa Longa Teste",
        price: 19.99,
        description: "Camisa longa gerada pela seed",
        stock: 99,
        sku: "CLT-001",
        category_id: (categories.find(function(cat) { return cat.name === "Camisas"; }) || {}).category_id,
      },
      {
        name: "Calça Jeans Teste",
        price: 49.99,
        description: "Calça jeans gerada pela seed",
        stock: 50,
        sku: "CJT-002",
        category_id: (categories.find(function(cat) { return cat.name === "Calças"; }) || {}).category_id,
      },
      {
        name: "Tênis Esportivo Teste",
        price: 89.99,
        description: "Tênis esportivo gerado pela seed",
        stock: 30,
        sku: "TET-003",
        category_id: (categories.find(function(cat) { return cat.name === "Tênis"; }) || {}).category_id,
      },
      {
        name: "Bermuda de Praia Teste",
        price: 29.99,
        description: "Bermuda de praia gerada pela seed",
        stock: 20,
        sku: "BPT-004",
        category_id: (categories.find(function(cat) { return cat.name === "Bermudas"; }) || {}).category_id,
      },
    ],
  });
}

main()
  .then(function () {
    console.log("Seed finalizada com sucesso!");
  })
  .catch(function (e) {
    console.error("Erro ao rodar a seed:", e);
    process.exit(1);
  })
  .finally(async function () {
    await prisma.$disconnect();
  });
