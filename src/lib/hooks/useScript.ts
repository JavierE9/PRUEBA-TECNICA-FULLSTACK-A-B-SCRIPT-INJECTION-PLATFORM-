import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Script } from '@/tipos/basedatos';

/**
 * Hook personalizado para manejar la lógica de edición de scripts
 */
export function useScript(id: string) {
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarScript = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuesta = await fetch(`/api/scripts/${id}`);
      
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      
      const datos = await respuesta.json();

      if (datos.error) {
        throw new Error(datos.error);
      }
      
      setScript(datos.datos);
      setNombre(datos.datos.nombre);
      setDescripcion(datos.datos.descripcion || '');
      setCodigo(datos.datos.codigo);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar el script';
      setError(mensaje);
      toast.error(mensaje);
      setTimeout(() => router.push('/scripts'), 2000);
    } finally {
      setCargando(false);
    }
  }, [id, router]);

  const guardarScript = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return false;
    }

    if (!descripcion.trim()) {
      toast.error('La descripción es obligatoria');
      return false;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch(`/api/scripts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          codigo,
        }),
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: No se pudo guardar`);
      }

      const datos = await respuesta.json();

      if (datos.error) {
        throw new Error(datos.error);
      }
      
      setScript(datos.datos);
      toast.success('Script guardado correctamente');
      return true;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al guardar el script';
      toast.error(mensaje);
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const publicarScript = async () => {
    setPublicando(true);
    try {
      // Primero guardamos los cambios
      const guardadoExitoso = await guardarScript();
      if (!guardadoExitoso) {
        setPublicando(false);
        return;
      }

      const respuesta = await fetch(`/api/scripts/${id}/publicar`, {
        method: 'POST',
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: No se pudo publicar`);
      }

      const datos = await respuesta.json();

      if (datos.error) {
        throw new Error(datos.error);
      }
      
      setScript(datos.datos);
      toast.success('¡Script publicado! Ya está disponible públicamente.');
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al publicar el script';
      toast.error(mensaje);
    } finally {
      setPublicando(false);
    }
  };

  const despublicarScript = async () => {
    try {
      const respuesta = await fetch(`/api/scripts/${id}/despublicar`, {
        method: 'POST',
      });

      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: No se pudo despublicar`);
      }

      const datos = await respuesta.json();

      if (datos.error) {
        throw new Error(datos.error);
      }
      
      setScript(datos.datos);
      toast.success('Script despublicado. Ahora es un borrador.');
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al despublicar el script';
      toast.error(mensaje);
    }
  };

  return {
    script,
    nombre,
    descripcion,
    codigo,
    cargando,
    guardando,
    publicando,
    error,
    setNombre,
    setDescripcion,
    setCodigo,
    cargarScript,
    guardarScript,
    publicarScript,
    despublicarScript,
  };
}
