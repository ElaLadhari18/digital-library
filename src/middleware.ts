import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  
  // On récupère le rôle stocké dans la session (configuré dans auth.ts)
  const isAdmin = req.auth?.user?.role === "ADMIN"

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/"
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/books/add")
  const isUserRoute = nextUrl.pathname.startsWith("/my-books")

  // 1. Laisser passer les requêtes API Auth
  if (isApiAuthRoute) return NextResponse.next()

  // 2. Protection des routes ADMIN (Seul un ADMIN connecté passe)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (!isAdmin) {
      // Si connecté mais pas ADMIN, on renvoie vers le catalogue
      return NextResponse.redirect(new URL("/books", nextUrl))
    }
  }

  // 3. Protection des routes UTILISATEUR (Tout utilisateur connecté passe)
  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}