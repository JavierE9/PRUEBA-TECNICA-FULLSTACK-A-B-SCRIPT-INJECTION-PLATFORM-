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
    <html lang="es" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen">
          {/* Barra de navegación */}
          <nav className="border-b backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" 
                         style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}>
                      <span className="text-[#0d0d17] font-black text-sm">AB</span>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
                      Script Injection
                    </span>
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
          theme="dark"
        />
      </body>
    </html>
  );
}
