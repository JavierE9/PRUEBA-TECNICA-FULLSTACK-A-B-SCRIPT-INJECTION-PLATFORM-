import { supabase } from './supabase';
import type { Script, ScriptInsertar, ScriptActualizar, RespuestaAPI } from '@/tipos/basedatos';
import { generarIdPublico } from './utilidades';

/**
 * Servicio de Scripts - maneja todas las operaciones de base de datos
 * Implementa el patrón repositorio para acceso limpio a datos
 */

export const servicioScripts = {
  /**
   * Obtener todos los scripts, ordenados por más recientemente actualizados
   */
  async obtenerTodos(): Promise<RespuestaAPI<Script[]>> {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .order('fecha_actualizacion', { ascending: false });

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al obtener scripts:', error);
      return { datos: null, error: 'Error al obtener los scripts' };
    }
  },

  /**
   * Obtener un script por su ID interno
   */
  async obtenerPorId(id: string): Promise<RespuestaAPI<Script>> {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al obtener script:', error);
      return { datos: null, error: 'Error al obtener el script' };
    }
  },

  /**
   * Obtener un script publicado por su ID público
   * Usado para servir scripts mediante el endpoint público
   */
  async obtenerPorIdPublico(idPublico: string): Promise<RespuestaAPI<Script>> {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('id_publico', idPublico)
        .eq('estado', 'publicado')
        .single();

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al obtener script público:', error);
      return { datos: null, error: 'Script no encontrado o no publicado' };
    }
  },

  /**
   * Crear un nuevo script (empieza como borrador)
   */
  async crear(script: ScriptInsertar): Promise<RespuestaAPI<Script>> {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .insert({
          ...script,
          estado: 'borrador',
        })
        .select()
        .single();

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al crear script:', error);
      return { datos: null, error: 'Error al crear el script' };
    }
  },

  /**
   * Actualizar un script existente
   */
  async actualizar(id: string, actualizaciones: ScriptActualizar): Promise<RespuestaAPI<Script>> {
    try {
      const { data, error } = await supabase
        .from('scripts')
        .update({
          ...actualizaciones,
          fecha_actualizacion: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al actualizar script:', error);
      return { datos: null, error: 'Error al actualizar el script' };
    }
  },

  /**
   * Guardar script como borrador (actualiza código sin cambiar estado)
   */
  async guardarBorrador(id: string, codigo: string): Promise<RespuestaAPI<Script>> {
    return this.actualizar(id, { codigo });
  },

  /**
   * Publicar un script - genera ID público si no existe
   */
  async publicar(id: string): Promise<RespuestaAPI<Script>> {
    try {
      // Primero verificamos si el script ya tiene un id_publico
      const { datos: existente } = await this.obtenerPorId(id);
      
      const idPublico = existente?.id_publico || generarIdPublico();
      
      const { data, error } = await supabase
        .from('scripts')
        .update({
          estado: 'publicado',
          id_publico: idPublico,
          fecha_publicacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { datos: data, error: null };
    } catch (error) {
      console.error('Error al publicar script:', error);
      return { datos: null, error: 'Error al publicar el script' };
    }
  },

  /**
   * Despublicar un script (revertir a borrador)
   */
  async despublicar(id: string): Promise<RespuestaAPI<Script>> {
    return this.actualizar(id, { estado: 'borrador' });
  },

  /**
   * Eliminar un script
   */
  async eliminar(id: string): Promise<RespuestaAPI<null>> {
    try {
      const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { datos: null, error: null };
    } catch (error) {
      console.error('Error al eliminar script:', error);
      return { datos: null, error: 'Error al eliminar el script' };
    }
  },
};
