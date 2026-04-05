"use client"

import { useState } from "react"
import { createBook } from "@/app/books/actions"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
}

export default function AddBookForm({ categories }: { categories: Category[] }) {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setErrors({})
    
    const result = await createBook(formData)
    
    if (result?.errors) {
      setErrors(result.errors)
      setIsPending(false)
    } else {
      // Succès : on redirige vers la liste
      router.push("/books")
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      {/* TITRE */}
      <div>
        <label className="block text-sm font-bold mb-2">Titre du livre</label>
        <input 
          name="title" 
          className={`w-full p-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
          placeholder="Ex: Le Petit Prince"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
      </div>

      {/* AUTEUR */}
      <div>
        <label className="block text-sm font-bold mb-2">Auteur</label>
        <input 
          name="author" 
          className={`w-full p-3 rounded-xl border ${errors.author ? 'border-red-500' : 'border-slate-200'}`}
          placeholder="Ex: Antoine de Saint-Exupéry"
        />
        {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author[0]}</p>}
      </div>

      {/* CATÉGORIE (Liste déroulante dynamique) */}
      <div>
        <label className="block text-sm font-bold mb-2">Catégorie</label>
        <select 
          name="categoryId" 
          className={`w-full p-3 rounded-xl border bg-white ${errors.categoryId ? 'border-red-500' : 'border-slate-200'}`}
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId[0]}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:bg-slate-300"
      >
        {isPending ? "Enregistrement..." : "Ajouter au catalogue"}
      </button>
    </form>
  )
}