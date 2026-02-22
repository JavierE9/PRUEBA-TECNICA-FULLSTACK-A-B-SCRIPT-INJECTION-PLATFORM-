// Mock de nanoid

import { servicioScripts } from '../servicioScripts';
import { supabase } from '../supabase';


jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'abc123xyz0'
}));


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

  describe('buscar', () => {
    const scriptsEjemplo = [
      {
        id: '1',
        nombre: 'Banner Promocional',
        descripcion: 'Banner de prueba A/B',
        codigo: 'console.log("banner");',
        estado: 'publicado',
        fecha_actualizacion: '2026-02-20T10:00:00Z'
      },
      {
        id: '2',
        nombre: 'Cambio de Color',
        descripcion: 'Cambia el color de fondo',
        codigo: 'document.body.style.background = "blue";',
        estado: 'borrador',
        fecha_actualizacion: '2026-02-21T10:00:00Z'
      },
      {
        id: '3',
        nombre: 'Botón CTA',
        descripcion: 'Mejora el botón principal',
        codigo: 'const btn = document.querySelector(".btn");',
        estado: 'publicado',
        fecha_actualizacion: '2026-02-22T10:00:00Z'
      },
    ];

    it('debe buscar scripts sin filtro y retornar primera página', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo,
          error: null,
          count: 3
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('', 1, 9);

      expect(resultado.error).toBeNull();
      expect(resultado.datos).toBeDefined();
      expect(resultado.datos?.scripts).toHaveLength(3);
      expect(resultado.datos?.total).toBe(3);
      expect(resultado.datos?.pagina).toBe(1);
      expect(resultado.datos?.totalPaginas).toBe(1);
      expect(mockQuery.range).toHaveBeenCalledWith(0, 8); // Primera página: 0 a 8
    });

    it('debe buscar por nombre y retornar resultados coincidentes', async () => {
      const scriptsCoincidentes = [scriptsEjemplo[0]]; // Solo "Banner Promocional"
      
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsCoincidentes,
          error: null,
          count: 1
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('banner', 1, 9);

      expect(resultado.error).toBeNull();
      expect(resultado.datos?.scripts).toHaveLength(1);
      expect(resultado.datos?.scripts[0].nombre).toBe('Banner Promocional');
      expect(mockQuery.or).toHaveBeenCalledWith('nombre.ilike.%banner%,descripcion.ilike.%banner%');
    });

    it('debe buscar por descripción y retornar resultados coincidentes', async () => {
      const scriptsCoincidentes = [scriptsEjemplo[1]]; // "Cambia el color de fondo"
      
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsCoincidentes,
          error: null,
          count: 1
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('color', 1, 9);

      expect(resultado.error).toBeNull();
      expect(resultado.datos?.scripts).toHaveLength(1);
      expect(resultado.datos?.scripts[0].descripcion).toContain('color');
    });

    it('debe retornar array vacío cuando no hay coincidencias', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [],
          error: null,
          count: 0
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('noexistente', 1, 9);

      expect(resultado.error).toBeNull();
      expect(resultado.datos?.scripts).toEqual([]);
      expect(resultado.datos?.total).toBe(0);
      expect(resultado.datos?.totalPaginas).toBe(0);
    });

    it('debe paginar correctamente - segunda página', async () => {
      const scriptsPagina2 = [scriptsEjemplo[2]];
      
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsPagina2,
          error: null,
          count: 11 // Total de 11 scripts
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('', 2, 9); // Página 2, 9 por página

      expect(resultado.error).toBeNull();
      expect(resultado.datos?.pagina).toBe(2);
      expect(resultado.datos?.total).toBe(11);
      expect(resultado.datos?.totalPaginas).toBe(2); // Math.ceil(11/9) = 2
      expect(mockQuery.range).toHaveBeenCalledWith(9, 17); // Segunda página: 9 a 17
    });

    it('debe calcular correctamente el total de páginas', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo,
          error: null,
          count: 27 // 27 scripts totales
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('', 1, 9);

      expect(resultado.datos?.totalPaginas).toBe(3); // Math.ceil(27/9) = 3
    });

    it('debe paginar con tamaño personalizado', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo.slice(0, 2),
          error: null,
          count: 100
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('', 1, 2); // 2 por página

      expect(resultado.datos?.totalPaginas).toBe(50); // Math.ceil(100/2) = 50
      expect(mockQuery.range).toHaveBeenCalledWith(0, 1); // Primera página: 0 a 1
    });

    it('debe buscar con espacios en blanco y filtrar correctamente', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [scriptsEjemplo[0]],
          error: null,
          count: 1
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('  banner  ', 1, 9);

      expect(resultado.error).toBeNull();
      expect(mockQuery.or).toHaveBeenCalledWith('nombre.ilike.%  banner  %,descripcion.ilike.%  banner  %');
    });

    it('debe ordenar por fecha_actualizacion descendente', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo,
          error: null,
          count: 3
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      await servicioScripts.buscar('', 1, 9);

      expect(mockQuery.order).toHaveBeenCalledWith('fecha_actualizacion', { ascending: false });
    });

    it('debe manejar errores de base de datos', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Error de conexión'),
          count: null
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('test', 1, 9);

      expect(resultado.error).toBe('Error al buscar scripts');
      expect(resultado.datos?.scripts).toEqual([]);
      expect(resultado.datos?.total).toBe(0);
      expect(resultado.datos?.totalPaginas).toBe(0);
    });

    it('debe manejar count null o undefined', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo,
          error: null,
          count: null // Simular count ausente
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      const resultado = await servicioScripts.buscar('', 1, 9);

      expect(resultado.datos?.total).toBe(0);
      expect(resultado.datos?.totalPaginas).toBe(0);
    });

    it('debe usar valores predeterminados para página y porPagina', async () => {
      const mockFrom = supabase.from as jest.Mock;
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: scriptsEjemplo,
          error: null,
          count: 3
        }),
      };
      mockFrom.mockReturnValue(mockQuery);

      // Llamar con búsqueda para que se llame al método .or()
      const resultado = await servicioScripts.buscar('test');

      expect(resultado.datos?.pagina).toBe(1);
      expect(mockQuery.range).toHaveBeenCalledWith(0, 8); // Default: página 1, 9 por página
    });
  });
});
