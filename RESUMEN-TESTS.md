


1. Configuración
-  `jest.config.js` - Configuración principal de Jest con Next.js
-  `jest.setup.js` - Setup para testing-library/jest-dom
-  `package.json` - Actualizado con scripts de test

2. Tests Implementados

 `src/lib/__tests__/utilidades.test.ts` (27 tests)
```
generarIdPublico (2 tests)
   - Generación de IDs de 10 caracteres
   - IDs válidos como strings

formatearFecha (2 tests)
   - Formateo correcto de fechas
   - Inclusión de hora y minutos

formatearTiempoRelativo (4 tests)
   - "ahora mismo" para fechas recientes
   - "hace X minutos" para minutos
   - "hace X horas" para horas
   - "hace X días" para días

obtenerUrlScriptPublico (2 tests)
   - Formato correcto de URL
   - Inclusión de ID público

obtenerScriptTag (3 tests)
   - Etiqueta script válida
   - Inclusión de ID en URL
   - Estructura correcta del tag

 validarJavaScript (5 tests)
   - Validación de código correcto
   - Detección de sintaxis incorrecta
   - Validación de funciones
   - Detección de llaves sin cerrar
   - Validación de código vacío

 envolverEnIIFE (6 tests)
   - Envoltorio en IIFE
   - Inclusión de 'use strict'
   - Manejo de errores con try-catch
   - Indentación correcta
   - Preservación de múltiples líneas
   - Mensaje de error personalizado
```

 `src/lib/__tests__/servicioScripts.test.ts` (24 tests)
```
 obtenerTodos (3 tests)
   - Array vacío cuando no hay scripts
   - Retorno de scripts cuando existen
   - Manejo de errores

 obtenerPorId (2 tests)
   - Retorno de script existente
   - Manejo de errores cuando no existe

 obtenerPorIdPublico (2 tests)
   - Retorno de script publicado
   - Error cuando no está publicado

 crear (2 tests)
   - Creación de nuevo script como borrador
   - Manejo de errores al crear

 actualizar (1 test)
   - Actualización de script existente

 eliminar (2 tests)
   - Eliminación correcta
   - Manejo de errores al eliminar

  buscar (14 tests) 
   - Búsqueda sin filtro y paginación básica
   - Búsqueda por nombre (case-insensitive)
   - Búsqueda por descripción (case-insensitive)
   - Sin resultados cuando no hay coincidencias
   - Paginación correcta - segunda página
   - Cálculo de total de páginas
   - Paginación con tamaño personalizado
   - Búsqueda con espacios en blanco
   - Ordenamiento por fecha_actualizacion DESC
   - Manejo de errores de base de datos
   - Manejo de count null o undefined
   - Uso de valores predeterminados (página=1, porPagina=9)
   - Validación de estructura de respuesta
   - Validación de rangos de paginación
```

  `src/lib/__tests__/tipos.test.ts` (8 tests)
```
 EstadoEditor (2 tests)
   - Creación de estado válido
   - Estado con cambios

 PropsTarjetaScript (3 tests)
   - Props en borrador
   - Props publicadas
   - Función de eliminación

 FormularioCrearScript (3 tests)
   - Formulario válido
   - Descripción vacía
   - Código vacío
```



---

 Dependencias Instaladas


{
  "devDependencies": {
    "jest": "^29.x",
    "@types/jest": "^29.x",
    "ts-jest": "^29.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "jest-environment-jsdom": "^29.x"
  }
}


---

## Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Modo watch (re-ejecuta automáticamente)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage

# Solo tests del buscador
npm test -- servicioScripts.test -t "buscar"

# Tests específicos por nombre
npm test -- -t "debe buscar por nombre"

# Ver output detallado
npm test -- --verbose
```





## Búsqueda y Paginación

### Método `buscar()` - Completamente Probado

```typescript
async buscar(
  busqueda: string,          // Término de búsqueda (nombre o descripción)
  pagina: number = 1,        // Página actual (default: 1)
  porPagina: number = 9      // Scripts por página (default: 9)
): Promise<RespuestaAPI<{
  scripts: Script[];         // Scripts encontrados
  total: number;             // Total de scripts sin paginar
  pagina: number;            // Página actual
  totalPaginas: number;      // Total de páginas calculadas
}>>
```

### Características Probadas

 **Búsqueda Inteligente**
- Case-insensitive (no importan mayúsculas/minúsculas)
- Búsqueda en nombre Y descripción simultáneamente
- Usa operador `ilike` de PostgreSQL/Supabase
- Pattern: `nombre.ilike.%busqueda%,descripcion.ilike.%busqueda%`

 **Paginación Eficiente**
- Cálculo automático de offset: `(pagina - 1) * porPagina`
- Range correcto: `range(inicio, fin)`
- Total de páginas: `Math.ceil(total / porPagina)`
- Maneja última página con scripts restantes

**Orden Inteligente**
- Ordenamiento por `fecha_actualizacion DESC`
- Scripts más recientes aparecen primero
- Consistente en todas las consultas

 **Manejo Robusto de Errores**
- Errores de BD → mensaje apropiado
- Count null/undefined → usa 0 como fallback
- Sin resultados → array vacío (no error)
- Validación de parámetros


### Ejemplo de Query Generado

```sql
-- Búsqueda con paginación
SELECT * FROM scripts
WHERE nombre ILIKE '%banner%' OR descripcion ILIKE '%banner%'
ORDER BY fecha_actualizacion DESC
LIMIT 9 OFFSET 0;

-- Count total (para calcular páginas)
SELECT COUNT(*) FROM scripts
WHERE nombre ILIKE '%banner%' OR descripcion ILIKE '%banner%';
```

### Estructura de Respuesta Validada

```typescript
// Respuesta exitosa
{
  datos: {
    scripts: [
      {
        id: "uuid-123",
        nombre: "Banner Promocional",
        descripcion: "Banner de prueba A/B",
        codigo: "console.log('test');",
        estado: "publicado",
        fecha_actualizacion: "2026-02-22T10:00:00Z",
        // ... más campos
      }
    ],
    total: 10,              // Total de scripts encontrados
    pagina: 1,              // Página actual
    totalPaginas: 2         // Math.ceil(10/9) = 2 páginas
  },
  error: null
}

// Respuesta con error
{
  datos: {
    scripts: [],
    total: 0,
    pagina: 1,
    totalPaginas: 0
  },
  error: "Error al buscar scripts"
}
```



##  Notas Técnicas

### Mocks de nanoid
```typescript
jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'abc123xyz0'
}));
```

### Mocks de Supabase
```typescript
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),        // Para búsqueda
      range: jest.fn().mockReturnThis(),     // Para paginación
      single: jest.fn(),
    })),
  },
}));
```

### Ejemplo de Mock para Búsqueda
```typescript
const mockQuery = {
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  range: jest.fn().mockResolvedValue({
    data: scriptsEjemplo,
    error: null,
    count: 10  // Total de registros
  }),
};
mockFrom.mockReturnValue(mockQuery);

// Verificar que se llamó correctamente
expect(mockQuery.or).toHaveBeenCalledWith(
  'nombre.ilike.%banner%,descripcion.ilike.%banner%'
);
expect(mockQuery.range).toHaveBeenCalledWith(0, 8);
```

