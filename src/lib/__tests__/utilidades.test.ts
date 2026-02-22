// Mock de nanoid
jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'abc123xyz0'
}));

import {
  formatearFecha,
  formatearTiempoRelativo,
  obtenerUrlScriptPublico,
  obtenerScriptTag,
  validarJavaScript,
  envolverEnIIFE,
  generarIdPublico
} from '../utilidades';

describe('Utilidades', () => {
  describe('generarIdPublico', () => {
    it('debe generar un ID de 10 caracteres', () => {
      const id = generarIdPublico();
      expect(id).toHaveLength(10);
    });

    it('debe generar IDs válidos', () => {
      const id = generarIdPublico();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('formatearFecha', () => {
    it('debe formatear una fecha correctamente', () => {
      const fecha = '2024-01-15T10:30:00.000Z';
      const resultado = formatearFecha(fecha);
      expect(resultado).toContain('ene');
      expect(resultado).toContain('15');
      expect(resultado).toContain('2024');
    });

    it('debe incluir hora y minutos', () => {
      const fecha = '2024-01-15T10:30:00.000Z';
      const resultado = formatearFecha(fecha);
      expect(resultado).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatearTiempoRelativo', () => {
    it('debe devolver "ahora mismo" para fechas muy recientes', () => {
      const ahora = new Date();
      const resultado = formatearTiempoRelativo(ahora.toISOString());
      expect(resultado).toBe('ahora mismo');
    });

    it('debe devolver "hace X minutos" para fechas de hace minutos', () => {
      const hace5Minutos = new Date(Date.now() - 5 * 60 * 1000);
      const resultado = formatearTiempoRelativo(hace5Minutos.toISOString());
      expect(resultado).toContain('minuto');
    });

    it('debe devolver "hace X horas" para fechas de hace horas', () => {
      const hace2Horas = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const resultado = formatearTiempoRelativo(hace2Horas.toISOString());
      expect(resultado).toContain('hora');
    });

    it('debe devolver "hace X días" para fechas de hace días', () => {
      const hace3Dias = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const resultado = formatearTiempoRelativo(hace3Dias.toISOString());
      expect(resultado).toContain('día');
    });
  });

  describe('obtenerUrlScriptPublico', () => {
    it('debe generar una URL con el formato correcto', () => {
      const idPublico = 'abc123xyz';
      const url = obtenerUrlScriptPublico(idPublico);
      expect(url).toContain('/p/');
      expect(url).toContain('.js');
      expect(url).toContain(idPublico);
    });

    it('debe incluir el ID público en la URL', () => {
      const idPublico = 'testid123';
      const url = obtenerUrlScriptPublico(idPublico);
      expect(url).toBe(`http://localhost:3000/p/${idPublico}.js`);
    });
  });

  describe('obtenerScriptTag', () => {
    it('debe generar una etiqueta script válida', () => {
      const idPublico = 'abc123';
      const tag = obtenerScriptTag(idPublico);
      expect(tag).toMatch(/<script src=".*"><\/script>/);
    });

    it('debe incluir el ID público en la URL del script tag', () => {
      const idPublico = 'abc123';
      const tag = obtenerScriptTag(idPublico);
      expect(tag).toContain(idPublico);
      expect(tag).toContain('.js');
    });

    it('debe contener la estructura correcta de script tag', () => {
      const idPublico = 'test123';
      const tag = obtenerScriptTag(idPublico);
      expect(tag).toContain('<script src=');
      expect(tag).toContain('</script>');
    });
  });

  describe('validarJavaScript', () => {
    it('debe validar código JavaScript correcto', () => {
      const codigo = 'console.log("Hola mundo");';
      const resultado = validarJavaScript(codigo);
      expect(resultado.valido).toBe(true);
      expect(resultado.error).toBeUndefined();
    });

    it('debe detectar sintaxis incorrecta', () => {
      const codigo = 'console.log("sin cerrar';
      const resultado = validarJavaScript(codigo);
      expect(resultado.valido).toBe(false);
      expect(resultado.error).toBeDefined();
    });

    it('debe validar funciones correctamente', () => {
      const codigo = 'function test() { return true; }';
      const resultado = validarJavaScript(codigo);
      expect(resultado.valido).toBe(true);
    });

    it('debe detectar llaves sin cerrar', () => {
      const codigo = 'if (true) { console.log("test");';
      const resultado = validarJavaScript(codigo);
      expect(resultado.valido).toBe(false);
      expect(resultado.error).toBeDefined();
    });

    it('debe validar código vacío', () => {
      const codigo = '';
      const resultado = validarJavaScript(codigo);
      expect(resultado.valido).toBe(true);
    });
  });

  describe('envolverEnIIFE', () => {
    it('debe envolver el código en un IIFE', () => {
      const codigo = 'console.log("test");';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain('(function()');
      expect(resultado).toContain('})();');
    });

    it('debe incluir use strict', () => {
      const codigo = 'var x = 5;';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain("'use strict'");
    });

    it('debe incluir manejo de errores con try-catch', () => {
      const codigo = 'console.log("test");';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain('try {');
      expect(resultado).toContain('} catch (e) {');
    });

    it('debe indentar el código correctamente', () => {
      const codigo = 'console.log("test");';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain('    console.log("test");');
    });

    it('debe preservar múltiples líneas de código', () => {
      const codigo = 'var x = 1;\nvar y = 2;';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain('var x = 1;');
      expect(resultado).toContain('var y = 2;');
    });

    it('debe incluir mensaje de error personalizado', () => {
      const codigo = 'test();';
      const resultado = envolverEnIIFE(codigo);
      expect(resultado).toContain('[AB Script Injection]');
    });
  });
});
