import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plataforma de Inyección de Scripts A/B',
  description: 'Crea, edita y publica código JavaScript para pruebas A/B y experimentación',
};

export default function LayoutPrincipal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Barra de navegación */}
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AB</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      Inyección de Scripts
                    </span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/scripts"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Mis Scripts
                  </Link>
                  <Link
                    href="/scripts/nuevo"
                    className="btn-primario text-sm"
                  >
                    Nuevo Script
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{ duration: 4000 }}
        />
      </body>
    </html>
  );
}
