import Link from 'next/link';
import { Code, Zap, Globe, Shield } from 'lucide-react';

export default function PaginaInicio() {
  return (
    <div className="relative">
      {/* Sección Hero */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            <span className="text-white">Plataforma de Inyección</span>
            <span className="block bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent"> de Scripts A/B</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Crea, edita y publica código JavaScript que puede ser inyectado en cualquier 
            página web. Perfecto para pruebas A/B, experimentación y modificaciones dinámicas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/scripts/nuevo" className="btn-primario text-lg px-8 py-3">
              Crear Tu Primer Script
            </Link>
            <Link
              href="/scripts"
              className="text-sm font-semibold leading-6 text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              Ver Todos los Scripts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de Características */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#00ff88] uppercase tracking-wider">
            Características Principales
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitas para inyección de scripts
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl" 
                     style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                  <Code className="h-6 w-6 text-[#0d0d17]" />
                </div>
                Editor de Código Monaco
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Escribe JavaScript con resaltado de sintaxis, autocompletado y detección 
                de errores usando el mismo editor que usa VS Code.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl" 
                     style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                  <Zap className="h-6 w-6 text-[#0d0d17]" />
                </div>
                Publicación Instantánea
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Publica tus scripts al instante y obtén una URL única que puede ser 
                incrustada en cualquier sitio web con un simple script tag.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl" 
                     style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                  <Globe className="h-6 w-6 text-[#0d0d17]" />
                </div>
                Compatibilidad Universal
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Los scripts funcionan en cualquier dominio sin autenticación. Los endpoints 
                con CORS habilitado aseguran integración perfecta en todas partes.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl" 
                     style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                  <Shield className="h-6 w-6 text-[#0d0d17]" />
                </div>
                Ejecución Segura
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                Los scripts se envuelven en IIFEs con modo estricto y manejo de errores 
                para prevenir conflictos con la página host.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cómo Funciona */}
      <div className="py-24 tarjeta mx-6 lg:mx-8 mb-12 rounded-2xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Cómo Funciona?
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <ol className="relative border-l border-[rgba(0,255,136,0.3)]">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5" 
                      style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}>
                  <span className="text-[#0d0d17] font-black">1</span>
                </span>
                <h3 className="font-bold text-white text-lg">Escribe Tu Código</h3>
                <p className="text-gray-400">Usa nuestro editor Monaco para escribir JavaScript que modifique la página objetivo.</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5" 
                      style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}>
                  <span className="text-[#0d0d17] font-black">2</span>
                </span>
                <h3 className="font-bold text-white text-lg">Guarda como Borrador</h3>
                <p className="text-gray-400">Guarda tu trabajo como borrador mientras refinas y pruebas tu código.</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5" 
                      style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}>
                  <span className="text-[#0d0d17] font-black">3</span>
                </span>
                <h3 className="font-bold text-white text-lg">Publica</h3>
                <p className="text-gray-400">Cuando estés listo, publica para generar una URL pública única para tu script.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-5" 
                      style={{ background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}>
                  <span className="text-[#0d0d17] font-black">4</span>
                </span>
                <h3 className="font-bold text-white text-lg">Incrusta</h3>
                <p className="text-gray-400">Añade el script tag a cualquier sitio web y observa cómo tu código se ejecuta.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
