import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Début du remplissage de la base de données...")

  // 1. Création des Catégories
  const categories = [
    { name: "Développement Web" },
    { name: "Base de données" },
    { name: "Intelligence Artificielle" },
    { name: "Design & UX" },
    { name: "Algorithmique" },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }

  const devWeb = await prisma.category.findUnique({ where: { name: "Développement Web" } })
  const db = await prisma.category.findUnique({ where: { name: "Base de données" } })

  // 2. Création des Livres
  const books = [
    {
      title: "Mastering Next.js 15",
      author: "Alex Vercel",
      isbn: "978-1234567890",
      categoryId: devWeb?.id,
    },
    {
      title: "Prisma for Beginners",
      author: "Sarah Relational",
      isbn: "978-0987654321",
      categoryId: db?.id,
    },
    {
      title: "TypeScript Deep Dive",
      author: "Basarat Ali",
      isbn: "978-1122334455",
      categoryId: devWeb?.id,
    },
    {
      title: "PostgreSQL Advanced",
      author: "Database Master",
      isbn: "978-5566778899",
      categoryId: db?.id,
    },
    {
      title: "React Design Patterns",
      author: "Addy Osmani",
      isbn: "978-9988776655",
      categoryId: devWeb?.id,
    },
  ]

  for (const book of books) {
    await prisma.book.create({
      data: book,
    })
  }

  console.log("✅ Base de données remplie avec 5 livres et 5 catégories !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })