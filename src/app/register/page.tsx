import { registerUser } from "./actions"
import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function RegisterPage() {
  // 1. Protection : Si l'utilisateur est déjà connecté, on le redirige vers l'accueil
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Créer un compte</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Rejoignez la Digital Library SWM</p>
        </div>

        {/* --- INSCRIPTION VIA GOOGLE --- */}
        <form 
          action={async () => { 
            "use server"; 
            await signIn("google"); 
          }} 
          className="mb-6"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-4 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-800 font-semibold active:scale-[0.98]"
          >
            <img 
              src="https://authjs.dev/img/providers/google.svg" 
              alt="Google" 
              className="w-5 h-5" 
              style={{ minWidth: '20px' }}
            />
            S inscrire avec Google
          </button>
        </form>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">OU</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        {/* --- FORMULAIRE D'INSCRIPTION CLASSIQUE --- */}
        <form action={registerUser} className="space-y-4">
          
          {/* Nom */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1 uppercase tracking-wider">Nom complet</label>
            <input 
              name="name" 
              type="text" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400" 
              placeholder="Ex: Jean Dupont" 
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400" 
              placeholder="nom@exemple.com" 
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1 uppercase tracking-wider">Type de compte</label>
            <select 
              name="role" 
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-gray-900 cursor-pointer appearance-none"
            >
              <option value="USER">Membre (Consultation)</option>
              <option value="ADMIN">Administrateur (Gestion)</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5 ml-1 uppercase tracking-wider">Mot de passe</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-400" 
              placeholder="••••••••" 
            />
          </div>

          {/* Bouton Submit */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4 active:scale-[0.99]"
          >
            Créer mon compte
          </button>
        </form>

        {/* Pied de page */}
        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline transition-all">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}