import Link from 'next/link';
import { Code, Zap, Globe, Shield } from 'lucide-react';

export default function PaginaInicio() {
  return (
    <div className="relative">
      {/* Sección Hero */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Plataforma de Inyección
            <span className="text-blue-600"> de Scripts A/B</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Crea, edita y publica código JavaScript que puede ser inyectado en cualquier 
            página web. Perfecto para pruebas A/B, experimentación y modificaciones dinámicas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/scripts/nuevo" className="btn-primario text-lg px-8 py-3">
              Crear Tu Primer Script
            </Link>
            <Link
              href="/scripts"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
            >
              Ver Todos los Scripts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de Características */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Características Principales
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para inyección de scripts
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Code className="h-6 w-6 text-white" />
                </div>
                Editor de Código Monaco
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Escribe JavaScript con resaltado de sintaxis, autocompletado y detección 
                de errores usando el mismo editor que usa VS Code.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Publicación Instantánea
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Publica tus scripts al instante y obtén una URL única que puede ser 
                incrustada en cualquier sitio web con un simple script tag.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                Compatibilidad Universal
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Los scripts funcionan en cualquier dominio sin autenticación. Los endpoints 
                con CORS habilitado aseguran integración perfecta en todas partes.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                Ejecución Segura
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Los scripts se envuelven en IIFEs con modo estricto y manejo de errores 
                para prevenir conflictos con la página host.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cómo Funciona */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Cómo Funciona?
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <ol className="relative border-l border-gray-200">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-white font-bold">1</span>
                </span>
                <h3 className="font-semibold text-gray-900">Escribe Tu Código</h3>
                <p className="text-gray-600">Usa nuestro editor Monaco para escribir JavaScript que modifique la página objetivo.</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-white font-bold">2</span>
                </span>
                <h3 className="font-semibold text-gray-900">Guarda como Borrador</h3>
                <p className="text-gray-600">Guarda tu trabajo como borrador mientras refinas y pruebas tu código.</p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-white font-bold">3</span>
                </span>
                <h3 className="font-semibold text-gray-900">Publica</h3>
                <p className="text-gray-600">Cuando estés listo, publica para generar una URL pública única para tu script.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-white font-bold">4</span>
                </span>
                <h3 className="font-semibold text-gray-900">Incrusta</h3>
                <p className="text-gray-600">Añade el script tag a cualquier sitio web y observa cómo tu código se ejecuta.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
