"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBook(formData: FormData) {
  const title = formData.get("title") as string
  const author = formData.get("author") as string
  // On récupère l'ID de la catégorie choisie dans le formulaire (venant du seed)
  const categoryId = formData.get("categoryId") as string 

  await prisma.book.create({
    data: {
      title,
      author,
      //on connecte à une catégorie existante du seed
      category: {
        connect: { id: categoryId } 
      }
    },
  })

  revalidatePath("/books")
  redirect("/books")
}