"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBook(formData: FormData) {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const isbn = formData.get("isbn") as string

  // Insertion dans PostgreSQL via Prisma
  await prisma.book.create({
  data: {
    title,
    author,
    isbn,
    category: {
      connectOrCreate: {
        // ON UTILISE LE NOM ICI CAR L'ID EST UN TEXTE (CUID)
        where: { name: "Général" }, 
        create: { name: "Général" }
      }
    }
  },
})
  // On demande à Next.js de rafraîchir la liste des livres
  revalidatePath("/books")
  // On redirige vers la bibliothèque
  redirect("/books")
}