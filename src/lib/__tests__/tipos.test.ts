import type {
  EstadoEditor,
  PropsTarjetaScript,
  FormularioCrearScript
} from '../../tipos/index';

describe('Tipos', () => {
  describe('EstadoEditor', () => {
    it('debe permitir crear un estado de editor válido', () => {
      const estado: EstadoEditor = {
        codigo: 'console.log("test");',
        tieneCAmbios: false,
        estaGuardando: false,
        estaPublicando: false
      };

      expect(estado.codigo).toBe('console.log("test");');
      expect(estado.tieneCAmbios).toBe(false);
      expect(estado.estaGuardando).toBe(false);
      expect(estado.estaPublicando).toBe(false);
    });

    it('debe permitir un estado con cambios', () => {
      const estado: EstadoEditor = {
        codigo: 'var x = 1;',
        tieneCAmbios: true,
        estaGuardando: false,
        estaPublicando: false
      };

      expect(estado.tieneCAmbios).toBe(true);
    });
  });

  describe('PropsTarjetaScript', () => {
    it('debe permitir crear props de tarjeta en borrador', () => {
      const props: PropsTarjetaScript = {
        id: '123',
        nombre: 'Script de prueba',
        estado: 'borrador',
        fechaCreacion: '2024-01-01',
        fechaActualizacion: '2024-01-02',
        idPublico: null
      };

      expect(props.estado).toBe('borrador');
      expect(props.idPublico).toBeNull();
    });

    it('debe permitir crear props de tarjeta publicada', () => {
      const props: PropsTarjetaScript = {
        id: '456',
        nombre: 'Script publicado',
        estado: 'publicado',
        fechaCreacion: '2024-01-01',
        fechaActualizacion: '2024-01-02',
        idPublico: 'abc123xyz'
      };

      expect(props.estado).toBe('publicado');
      expect(props.idPublico).toBe('abc123xyz');
    });

    it('debe permitir incluir función de eliminación', () => {
      const mockEliminar = jest.fn();
      const props: PropsTarjetaScript = {
        id: '789',
        nombre: 'Script con eliminación',
        estado: 'borrador',
        fechaCreacion: '2024-01-01',
        fechaActualizacion: '2024-01-02',
        idPublico: null,
        alEliminar: mockEliminar
      };

      expect(props.alEliminar).toBeDefined();
      props.alEliminar?.('789');
      expect(mockEliminar).toHaveBeenCalledWith('789');
    });
  });

  describe('FormularioCrearScript', () => {
    it('debe permitir crear un formulario válido', () => {
      const formulario: FormularioCrearScript = {
        nombre: 'Nuevo Script',
        descripcion: 'Descripción del script',
        codigo: 'console.log("test");'
      };

      expect(formulario.nombre).toBe('Nuevo Script');
      expect(formulario.descripcion).toBe('Descripción del script');
      expect(formulario.codigo).toBe('console.log("test");');
    });

    it('debe permitir descripción vacía', () => {
      const formulario: FormularioCrearScript = {
        nombre: 'Script sin descripción',
        descripcion: '',
        codigo: 'var x = 1;'
      };

      expect(formulario.descripcion).toBe('');
    });

    it('debe permitir código vacío', () => {
      const formulario: FormularioCrearScript = {
        nombre: 'Script vacío',
        descripcion: 'Sin código inicial',
        codigo: ''
      };

      expect(formulario.codigo).toBe('');
    });
  });
});
