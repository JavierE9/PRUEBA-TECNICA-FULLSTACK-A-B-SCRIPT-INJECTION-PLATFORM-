/**
 * Tipos de base de datos para la Plataforma de Inyección de Scripts A/B
 * Estos tipos reflejan la estructura del esquema en Supabase
 */

// Estado del script: borrador o publicado
export type EstadoScript = 'borrador' | 'publicado';

// Interfaz principal del Script
export interface Script {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: EstadoScript;
  id_publico: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_publicacion: string | null;
}

// Para insertar un nuevo script
export interface ScriptInsertar {
  codigo: string;
  nombre: string;
  descripcion: string;
  estado?: EstadoScript;
  id_publico?: string | null;
}

// Para actualizar un script existente
export interface ScriptActualizar {
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: EstadoScript;
  id_publico?: string | null;
  fecha_publicacion?: string | null;
}

// Respuesta genérica de la API
export interface RespuestaAPI<T> {
  datos: T | null;
  error: string | null;
}

// Esquema de la base de datos para el cliente de Supabase
export interface BaseDatos {
  public: {
    Tables: {
      scripts: {
        Row: Script;
        Insert: ScriptInsertar;
        Update: ScriptActualizar;
      };
    };
  };
}
