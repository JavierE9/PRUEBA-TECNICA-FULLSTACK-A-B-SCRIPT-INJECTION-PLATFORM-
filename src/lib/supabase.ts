import { createClient } from '@supabase/supabase-js';
import type { BaseDatos } from '@/tipos/basedatos';

/**
 * Cliente de Supabase - Singleton para operaciones del lado del cliente
 * Usa la clave anónima que es segura exponer en el navegador
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. Por favor revisa tu archivo .env.local'
  );
}

export const supabase = createClient<BaseDatos>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, 
  },
});

/**
 *  Supabase para el servidor
 */
export function crearClienteSupabaseServidor() {
  return createClient<BaseDatos>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
