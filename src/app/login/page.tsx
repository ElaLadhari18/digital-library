import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return (
    // Fond blanc uni et padding pour l'espace
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      
      {/* Conteneur très simple sans ombre complexe */}
      <div className="w-full max-w-sm">
        
        {/* Titre simple */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Digital Library</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour continuer</p>
        </div>

        {/* --- Section Google --- */}
        <form action={async () => { "use server"; await signIn("google"); }} className="mb-6">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-4 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-800 font-semibold active:scale-[0.98]"
          >
            <img 
              src="https://authjs.dev/img/providers/google.svg" 
              alt="Google" 
              className="w-5 h-5" 
              style={{ minWidth: '20px' }} // Blindage
            />
            Continuer avec Google
          </button>
        </form>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">OU</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* --- Formulaire Credentials (Classique) --- */}
        <form
          action={async (formData) => { "use server"; await signIn("credentials", formData); }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5 ml-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="votre@email.com"
              // Fond léger pour les inputs pour contraster avec le fond blanc
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5 ml-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-3"
          >
            Se connecter
          </button>
        </form>

        {/* Lien Inscription */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Pas encore membre ?{" "}
          <a href="/register" className="text-blue-600 font-bold hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  )
}