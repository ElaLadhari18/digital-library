import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Nettoyage (Optionnel : supprime tout pour recommencer à zéro)
  await prisma.book.deleteMany()
  await prisma.category.deleteMany()

  // 2. Création des Catégories
  const cat1 = await prisma.category.create({ data: { name: 'Informatique' } })
  const cat2 = await prisma.category.create({ data: { name: 'Roman' } })
  const cat3 = await prisma.category.create({ data: { name: 'Développement Personnel' } })
  const cat4 = await prisma.category.create({ data: { name: 'Science-Fiction' } })

  // 3. Création des Livres
  await prisma.book.createMany({
    data: [
      {
        title: 'Apprendre Next.js 15',
        author: 'Jean SWM',
        categoryId: cat1.id,
      },
      {
        title: 'Le Guide de Prisma',
        author: 'Expert Isitcom',
        categoryId: cat1.id,
      },
      {
        title: 'L’Étranger',
        author: 'Albert Camus',
        categoryId: cat2.id,
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        categoryId: cat3.id,
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        categoryId: cat4.id,
      },
    ],
  })

  console.log('Base de données remplie avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })