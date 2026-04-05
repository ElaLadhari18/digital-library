"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
 const role = formData.get("role") as string // <--- On récupère le choix
  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé.")
  }

  // 2. Hasher le mot de passe (Sécurité SWM)
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Créer l'utilisateur dans PostgreSQL
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role, // <--- On enregistre le rôle choisi (ADMIN ou USER)
    },
  })

  // 4. Rediriger vers la page de connexion
  redirect("/login")
}