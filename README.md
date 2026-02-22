# 🧪 Plataforma de Inyección de Scripts A/B

Una aplicación web que permite crear, editar y publicar código JavaScript que puede ser inyectado en cualquier página web mediante un script externo.

## 📋 Características

- ✅ **Editor Monaco** - El mismo editor de VS Code con resaltado de sintaxis
- ✅ **Guardar como Borrador** - Guarda tu trabajo sin publicarlo
- ✅ **Publicación Instantánea** - Genera URL única pública
- ✅ **CORS Habilitado** - Funciona en cualquier dominio
- ✅ **Ejecución Segura** - Scripts envueltos en IIFE con manejo de errores
- ✅ **Persistencia en Supabase** - Base de datos PostgreSQL

## 🚀 Inicio Rápido

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repositorio>
cd plataforma-inyeccion-scripts-ab
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com) (plan gratuito)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/esquema.sql`
3. Ve a **Settings > API** y copia:
   - Project URL
   - Anon public key

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # Rutas API
│   │   │   └── scripts/       # CRUD de scripts
│   │   ├── p/[id]/            # Endpoint público de scripts
│   │   ├── scripts/           # Páginas de gestión
│   │   │   ├── nuevo/         # Crear nuevo script
│   │   │   └── [id]/          # Editar script
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── componentes/           # Componentes React
│   │   ├── EditorCodigo.tsx   # Editor Monaco
│   │   ├── TarjetaScript.tsx  # Tarjeta de script
│   │   └── PanelPublicacion.tsx
│   ├── lib/                   # Lógica de negocio
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── servicioScripts.ts # Operaciones CRUD
│   │   └── utilidades.ts      # Funciones helper
│   └── tipos/                 # Definiciones TypeScript
│       └── basedatos.ts       # Tipos de BD
├── supabase/
│   └── esquema.sql            # Schema de la BD
└── package.json
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/scripts` | Lista todos los scripts |
| POST | `/api/scripts` | Crea un nuevo script |
| GET | `/api/scripts/[id]` | Obtiene un script por ID |
| PUT | `/api/scripts/[id]` | Actualiza un script |
| DELETE | `/api/scripts/[id]` | Elimina un script |
| POST | `/api/scripts/[id]/publicar` | Publica un script |
| POST | `/api/scripts/[id]/despublicar` | Despublica un script |
| GET | `/p/[id].js` | **Script público** (Content-Type: application/javascript) |

## 🎯 Cómo Usar un Script Publicado

Una vez publicado, obtendrás una URL como:

```
https://tu-dominio.com/p/abc123xyz.js
```

Añádelo a cualquier página web:

```html
<script src="https://tu-dominio.com/p/abc123xyz.js"></script>
```

---

## 📖 Documentación de Decisiones Técnicas

### 1. ¿Cómo escalaría la aplicación para múltiples usuarios?

**Autenticación y Autorización:**
- Implementar Supabase Auth para gestión de usuarios
- Añadir campo `user_id` a la tabla scripts
- Configurar Row Level Security (RLS) para que cada usuario solo vea sus scripts

**Base de Datos:**
- Los índices ya están optimizados para búsquedas frecuentes
- Supabase escala automáticamente con PostgreSQL
- Para alto tráfico: considerar réplicas de lectura

**Infraestructura:**
- Desplegar en Vercel con Edge Functions para baja latencia
- Usar CDN (Cloudflare) para cachear scripts públicos
- Implementar rate limiting por IP/usuario

**Código:**
```typescript
// Ejemplo de RLS policy para multi-usuario
CREATE POLICY "Usuarios ven solo sus scripts" ON scripts
  FOR ALL
  USING (auth.uid() = user_id);
```

### 2. ¿Cómo evitar que el script afecte negativamente a la página host?

**Estrategias Implementadas:**

1. **IIFE (Immediately Invoked Function Expression):**
   ```javascript
   (function() {
     'use strict';
     // código del usuario aislado
   })();
   ```

2. **Modo Estricto:** Previene variables globales accidentales

3. **Try-Catch Global:** Errores no crashean la página host

**Mejoras Futuras:**

4. **Shadow DOM:** Para modificaciones DOM aisladas
   ```javascript
   const shadow = element.attachShadow({mode: 'closed'});
   ```

5. **Web Workers:** Para cálculos pesados sin bloquear UI

6. **Content Security Policy (CSP):** Headers restrictivos

7. **Sandbox iframe:** Para scripts no confiables
   ```html
   <iframe sandbox="allow-scripts" srcdoc="..."></iframe>
   ```

8. **Validación de código:** Analizar AST para detectar patrones peligrosos

### 3. ¿Cómo implementaría versionado?

**Esquema de Base de Datos:**
```sql
CREATE TABLE versiones_scripts (
  id UUID PRIMARY KEY,
  script_id UUID REFERENCES scripts(id),
  version INTEGER NOT NULL,
  codigo TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  notas_cambio TEXT
);

-- Índice para obtener versiones de un script
CREATE INDEX idx_versiones_script ON versiones_scripts(script_id, version DESC);
```

**Flujo de Trabajo:**
1. Cada "Guardar" crea una nueva versión
2. Mantener historial completo de cambios
3. Permitir rollback a versiones anteriores
4. Publicar versión específica (no siempre la última)

**UI:**
- Selector de versiones en el editor
- Vista de diff entre versiones
- Botón "Restaurar versión"

### 4. ¿Cómo añadiría segmentación A/B real y tracking de eventos?

**Arquitectura de Segmentación:**

```sql
-- Tabla de experimentos
CREATE TABLE experimentos (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255),
  estado VARCHAR(20), -- activo, pausado, completado
  fecha_inicio TIMESTAMP,
  fecha_fin TIMESTAMP
);

-- Variantes del experimento
CREATE TABLE variantes (
  id UUID PRIMARY KEY,
  experimento_id UUID REFERENCES experimentos(id),
  nombre VARCHAR(50), -- 'control', 'variante_a', 'variante_b'
  script_id UUID REFERENCES scripts(id),
  porcentaje INTEGER CHECK (porcentaje >= 0 AND porcentaje <= 100)
);

-- Tracking de eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY,
  experimento_id UUID,
  variante_id UUID,
  visitor_id VARCHAR(100), -- cookie anónima
  tipo_evento VARCHAR(50), -- 'impresion', 'click', 'conversion'
  metadata JSONB,
  fecha TIMESTAMP DEFAULT NOW()
);
```

**Script de Segmentación (cliente):**
```javascript
(function() {
  // Obtener o crear visitor_id
  const visitorId = localStorage.getItem('ab_visitor') || 
    crypto.randomUUID();
  localStorage.setItem('ab_visitor', visitorId);
  
  // Hash determinístico para asignación consistente
  const hash = hashCode(visitorId + experimentId);
  const bucket = hash % 100;
  
  // Asignar variante basada en porcentajes
  let variant = 'control';
  if (bucket < 50) variant = 'variante_a';
  
  // Cargar script de la variante
  loadScript(`/p/${variantScriptId}.js`);
  
  // Tracking automático
  window.abTrack = (event, data) => {
    fetch('/api/eventos', {
      method: 'POST',
      body: JSON.stringify({ visitorId, variant, event, data })
    });
  };
})();
```

**Dashboard de Resultados:**
- Tasa de conversión por variante
- Significancia estadística (test chi-cuadrado)
- Gráficos de tendencia temporal
- Exportar datos a CSV

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** Supabase (PostgreSQL)
- **Estilos:** Tailwind CSS
- **Editor:** Monaco Editor
- **Notificaciones:** Sonner
- **Iconos:** Lucide React

## 🔜 Mejoras Futuras

- [ ] Autenticación de usuarios
- [ ] Versionado de scripts
- [ ] Segmentación A/B real
- [ ] Dashboard de analytics
- [ ] Validación de sintaxis en tiempo real
- [ ] Plantillas de scripts predefinidas
- [ ] API rate limiting
- [ ] Tests automatizados

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto.

---

Desarrollado con ❤️ para la prueba técnica de A/B Script Injection Platform
