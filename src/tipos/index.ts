/**
 * Tipos compartidos usados en toda la aplicación
 */

// Estado del editor de código
export interface EstadoEditor {
  codigo: string;
  tieneCAmbios: boolean;
  estaGuardando: boolean;
  estaPublicando: boolean;
}

// Props para la tarjeta de script
export interface PropsTarjetaScript {
  id: string;
  nombre: string;
  estado: 'borrador' | 'publicado';
  fechaCreacion: string;
  fechaActualizacion: string;
  idPublico: string | null;
  alEliminar?: (id: string) => void;
}

// Formulario para crear script
export interface FormularioCrearScript {
  nombre: string;
  descripcion: string;
  codigo: string;
}
