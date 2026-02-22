// Mock de nanoid

import { servicioScripts } from '../servicioScripts';
import { supabase } from '../supabase';


jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'abc123xyz0'
}));

// Mock de Supabase
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));



describe('ServicioScripts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerTodos', () => {
    it('debe retornar un array vacío cuando no hay scripts', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const resultado = await servicioScripts.obtenerTodos();
      
      expect(resultado.datos).toEqual([]);
      expect(resultado.error).toBeNull();
    });

    it('debe retornar scripts cuando existen', async () => {
      const scriptsEjemplo = [
        { id: '1', nombre: 'Script 1', codigo: 'console.log(1);' },
        { id: '2', nombre: 'Script 2', codigo: 'console.log(2);' },
      ];

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: scriptsEjemplo, error: null }),
      });

      const resultado = await servicioScripts.obtenerTodos();
      
      expect(resultado.datos).toHaveLength(2);
      expect(resultado.error).toBeNull();
    });

    it('debe manejar errores correctamente', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: new Error('Error de base de datos') }),
      });

      const resultado = await servicioScripts.obtenerTodos();
      
      expect(resultado.datos).toEqual([]);
      expect(resultado.error).toBe('Error al obtener los scripts');
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar un script cuando existe', async () => {
      const scriptEjemplo = { id: '123', nombre: 'Script Test', codigo: 'console.log("test");' };

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: scriptEjemplo, error: null }),
      });

      const resultado = await servicioScripts.obtenerPorId('123');
      
      expect(resultado.datos).toEqual(scriptEjemplo);
      expect(resultado.error).toBeNull();
    });

    it('debe manejar errores cuando el script no existe', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('No encontrado') }),
      });

      const resultado = await servicioScripts.obtenerPorId('999');
      
      expect(resultado.datos).toBeNull();
      expect(resultado.error).toBe('Error al obtener el script');
    });
  });

  describe('obtenerPorIdPublico', () => {
    it('debe retornar un script publicado', async () => {
      const scriptPublicado = {
        id: '123',
        id_publico: 'abc123xyz',
        estado: 'publicado',
        codigo: 'console.log("público");'
      };

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: scriptPublicado, error: null }),
      });

      const resultado = await servicioScripts.obtenerPorIdPublico('abc123xyz');
      
      expect(resultado.datos).toEqual(scriptPublicado);
      expect(resultado.error).toBeNull();
    });

    it('debe retornar error cuando el script no está publicado', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('No encontrado') }),
      });

      const resultado = await servicioScripts.obtenerPorIdPublico('noexiste');
      
      expect(resultado.datos).toBeNull();
      expect(resultado.error).toBe('Script no encontrado o no publicado');
    });
  });

  describe('crear', () => {
    it('debe crear un nuevo script como borrador', async () => {
      const nuevoScript = {
        nombre: 'Nuevo Script',
        descripcion: 'Descripción',
        codigo: 'console.log("nuevo");'
      };

      const scriptCreado = {
        ...nuevoScript,
        id: '456',
        estado: 'borrador',
      };

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: scriptCreado, error: null }),
      });

      const resultado = await servicioScripts.crear(nuevoScript);
      
      expect(resultado.datos).toEqual(scriptCreado);
      expect(resultado.error).toBeNull();
    });

    it('debe manejar errores al crear', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Error al insertar') }),
      });

      const resultado = await servicioScripts.crear({
        nombre: 'Test',
        descripcion: 'Test',
        codigo: 'test'
      });
      
      expect(resultado.datos).toBeNull();
      expect(resultado.error).toBe('Error al crear el script');
    });
  });

  describe('actualizar', () => {
    it('debe actualizar un script existente', async () => {
      const scriptActualizado = {
        id: '123',
        nombre: 'Script Actualizado',
        codigo: 'console.log("actualizado");'
      };

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: scriptActualizado, error: null }),
      });

      const resultado = await servicioScripts.actualizar('123', { nombre: 'Script Actualizado' });
      
      expect(resultado.datos).toEqual(scriptActualizado);
      expect(resultado.error).toBeNull();
    });
  });

  describe('eliminar', () => {
    it('debe eliminar un script correctamente', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const resultado = await servicioScripts.eliminar('123');
      
      expect(resultado.datos).toBeNull();
      expect(resultado.error).toBeNull();
    });

    it('debe manejar errores al eliminar', async () => {
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: new Error('Error al eliminar') }),
      });

      const resultado = await servicioScripts.eliminar('999');
      
      expect(resultado.datos).toBeNull();
      expect(resultado.error).toBe('Error al eliminar el script');
    });
  });
});
