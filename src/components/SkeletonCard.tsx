export default function SkeletonCard() {
  return (
    <div className="border border-slate-100 rounded-3xl p-6 animate-pulse bg-white shadow-sm">
      <div className="flex justify-between mb-4">
        {/* Badge catégorie */}
        <div className="h-5 w-20 bg-slate-100 rounded-full"></div>
      </div>
      {/* Titre */}
      <div className="h-7 w-3/4 bg-slate-100 rounded-lg mb-3"></div>
      {/* Auteur */}
      <div className="h-4 w-1/2 bg-slate-100 rounded-lg mb-8"></div>
      {/* Bouton */}
      <div className="h-12 w-full bg-slate-50 rounded-2xl border border-slate-100"></div>
    </div>
  )
}