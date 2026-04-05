"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // On utilise un "debounce" pour ne pas requêter la DB à chaque lettre tapée
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0 mb-8">
      <label htmlFor="search" className="sr-only">Rechercher</label>
      <input
        className="peer block w-full rounded-2xl border border-slate-200 py-[12px] pl-10 text-sm outline-2 placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        placeholder="Rechercher un livre ou un auteur..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
    </div>
  )
}