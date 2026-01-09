// Middleware para protección de rutas
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Proteger rutas de administrador y cursos
  const path = req.nextUrl.pathname
  
  // Rutas protegidas que requieren autenticación
  if (path.startsWith('/administrator') || path.startsWith('/cursos/mi-escuela')) {
    // La autenticación se verifica en cada página individual con getSession()
    // Este middleware solo permite el acceso, la validación real está en los componentes
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/administrator/:path*', '/cursos/mi-escuela/:path*']
}
