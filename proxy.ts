import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith('/administrator') || path.startsWith('/cursos/mi-escuela')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/administrator/:path*', '/cursos/mi-escuela/:path*'],
}
