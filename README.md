#  Plataforma de Inyección de Scripts A/B

Bueno, básicamente esto es una app web donde puedes escribir código JavaScript, guardarlo y después inyectarlo en cualquier página web que quieras. La idea es que puedas hacer experimentos A/B sin tener que tocar el código de la web original.

##  Que tiene de interesante

-  **Editor de Texto** - Editor simple para escribir código
-  **Guardar como Borrador** - Puedes ir guardando tu trabajo sin que se publique todavía
-  **Publicación Instantánea** - Cuando publicas, te genera una URL única que puedes usar donde sea
-  **CORS Habilitado** - Funciona en cualquier dominio, no hay problema con eso
-  **Ejecución Segura** - Los scripts van envueltos en IIFE para que no rompan nada 
-  **Persistencia en Supabase** - Todo se guarda en PostgreSQL a través de Supabase



### 1. Clonar e instalar dependencias



```bash
git clone <tu-repositorio>
cd plataforma-inyeccion-scripts-ab
npm install
```

### 2. Configurar Supabase



1. Crea un proyecto en [Supabase](https://supabase.com) (el plan gratuito va perfecto)
2. Vete a **SQL Editor** y ejecuta todo lo que hay en `supabase/esquema.sql`
3. Ahora vete a **Settings > API** y copia:
   - Project URL (es tipo https://tuprojecto.supabase.co)
   - Anon public key (es una clave larguísima, no te equivoques)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raiz del proyecto (si no existe ya un ejemplo):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-super-larga
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Importante:** No subas este archivo a git, ya está en el .gitignore pero por si acaso.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Y ya está, abrehttp://localhost:3000/ en el navegador.

##  Como está organizado esto

La estructura del proyecto es bastante estandar de Next.js con App Router:

```
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # Rutas API (el backend va aquí)
│   │   │   └── scripts/       # CRUD de scripts
│   │   ├── p/[id]/            # Endpoint público de scripts
│   │   ├── scripts/           # Páginas de gestión
│   │   │   ├── nuevo/         # Crear nuevo script
│   │   │   └── [id]/          # Editar script existente
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── componentes/           # Componentes React reutilizables
│   │   ├── EditorCodigo.tsx   # Editor Monaco (el corazón de esto)
│   │   ├── TarjetaScript.tsx  # Tarjeta de script para la lista
│   │   └── PanelPublicacion.tsx # Panel derecho con info
│   ├── lib/                   # Lógica de negocio
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── servicioScripts.ts # Operaciones CRUD
│   │   └── utilidades.ts      # Funciones helper varias
│   └── tipos/                 # Definiciones TypeScript
│       └── basedatos.ts       # Tipos de BD
├── supabase/
│   └── esquema.sql            # Schema de la BD (tablas, indices, etc)
└── package.json
```

##  API Endpoints

Por si te interesa saber que endpoints hay disponibles:

| Método | Endpoint | Que hace |
|--------|----------|-------------|
| GET | `/api/scripts` | Te devuelve todos los scripts |
| POST | `/api/scripts` | Crea un script nuevo |
| GET | `/api/scripts/[id]` | Te trae un script específico |
| PUT | `/api/scripts/[id]` | Actualiza un script |
| DELETE | `/api/scripts/[id]` | Elimina un script (cuidado con este) |
| POST | `/api/scripts/[id]/publicar` | Publica un script |
| POST | `/api/scripts/[id]/despublicar` | Despublica un script |
| GET | `/p/[id].js` | **El endpoint público** (devuelve JS puro) |

## Como usar un script publicado

Cuando publicas un script, te genera una URL tipo:

```
https://tu-dominio.com/p/abc123xyz.js
```

Para usarlo en cualquier web, solo tienes que meter este tag:

```html
<script src="https://tu-dominio.com/p/abc123xyz.js"></script>
```

Y listo, el script se ejecutará en esa página. 

---

##  Decisiones Técnicas y Reflexiones

### 1. ¿Como escalaria esto para múltiples usuarios?

Bueno, ahora mismo no hay autenticación ni nada, pero si tuviera que escalar esto para que lo usen muchos usuarios, haría lo siguiente:

**Autenticación:**
Lo más facil sería usar Supabase Auth que ya está integrado. Añadiría un login con email/password o incluso con Google/GitHub que es más comodo. Cada usuario tendría su propia cuenta y solo vería sus scripts.

**Base de Datos:**
Tendría que añadir un campo `user_id` a la tabla de scripts y configurar Row Level Security (RLS) en Supabase. Esto es básicamente hacer que cada usuario solo pueda ver y editar sus propios scripts. Una policy de ejemplo sería algo así:

```sql
CREATE POLICY "Usuarios ven solo sus scripts" ON scripts
  FOR ALL
  USING (auth.uid() = user_id);
```

Supabase escala bastante bien automáticamente, pero si la cosa se pone muy seria con millones de usuarios, habría que pensar en:
- Añadir indices a las columnas que más se consultan (ya lo tengo hecho en parte)
- Usar réplicas de lectura para distribuir la carga
- Implementar caché con Redis para las consultas más frecuentes

**Infraestructura:**
Desplegar esto en Vercel es lo más lógico porque Next.js y Vercel van de la mano. Las Edge Functions de Vercel harían que los scripts se sirvan rápido desde cualquier parte del mundo.

También usaría un CDN como Cloudflare para cachear los scripts publicados, así no tengo que generarlos cada vez que alguien los pide. Esto reduce la carga en el servidor y mejora la velocidad.






### 2. ¿Como evitar que el script rompa la página donde se inyecta?



**Lo que ya está hecho:**

1. **IIFE (Immediately Invoked Function Expression):**
   Envuelvo todo el código del usuario en una función que se ejecuta inmediatamente:
   ```javascript
   (function() {
     'use strict';
     // código del usuario va aquí
   })();
   ```
   Esto crea un scope aislado y evita que las variables se cuelen en el scope global.

2. **Modo Estricto:** 
   El `'use strict'` hace que JavaScript sea más estricto y previene cosas raras como crear variables globales sin querer.

3. **Try-Catch Global:** 
   Todo va dentro de un try-catch para que si algo explota, el error se capture y no rompa la página host. Básicamente:
   ```javascript
   try {
     // código del usuario
   } catch(e) {
     console.error('Error en script A/B:', e);
   }
   ```

**Cosas que añadiría en el futuro:**

4. **Shadow DOM:** 
   Si el script necesita meter elementos en el DOM, usar Shadow DOM haría que los estilos y el HTML estén completamente aislados de la página. Es tipo un mini-DOM dentro del DOM principal.

5. **Web Workers:** 
   Para cálculos pesados o cosas que toman tiempo, usar Web Workers para que no bloquee el hilo principal. Así la página sigue respondiendo aunque el script esté haciendo algo pesado.

6. **Content Security Policy (CSP):** 
   Configurar headers CSP restrictivos en el servidor. Esto limitaría que tipos de cosas puede hacer el script (por ejemplo, evitar que haga requests a dominios desconocidos).

7. **Validación de código:** 
   Antes de guardar, analizar el código con algo como ESLint o un parser de AST para detectar patrones sospechosos o peligrosos. Por ejemplo, si alguien intenta hacer `while(true){}` para bloquear la página, rechazar el script.

8. **Timeout de ejecución:**
   Poner un límite de tiempo de ejecución. Si el script tarda más de X segundos, matarlo automáticamente.



### 3. ¿Como implementaria versionado?

El versionado sería super útil porque así puedes hacer cambios sin miedo a romper algo, y siempre puedes volver atras si la cagas.

**Esquema de Base de Datos:**
Crearía una tabla nueva para versiones:

```sql
CREATE TABLE versiones_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  codigo TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  notas_cambio TEXT,
  autor VARCHAR(100)
);

-- Indice para obtener versiones rapidamente
CREATE INDEX idx_versiones_script ON versiones_scripts(script_id, version DESC);

-- Constraint para que no haya versiones duplicadas
ALTER TABLE versiones_scripts 
  ADD CONSTRAINT unique_script_version UNIQUE (script_id, version);
```

**Como funcionaría:**
- Cada vez que guardas, se crea una nueva versión automáticamente (version 1, 2, 3, etc)
- La versión actual se guarda en la tabla principal `scripts`
- Puedes ver el historial completo de cambios
- Puedes restaurar una versión anterior con un click
- Cuando publicas, publicas una versión específica (no necesariamente la última si estas testeando)

**UI que añadiría:**
- Un dropdown en el editor para seleccionar que versión ver
- Vista de diff mostrando las diferencias entre dos versiones (tipo GitHub)
- Timeline visual con todas las versiones y cuando se crearon
- Campo opcional para notas de cambio ("arreglé el bug del selector")
- Botón "Restaurar esta versión" que copia el código de esa versión a una nueva

**Estrategia de almacenamiento:**
Guardaría cada versión completa (no diffs) porque:
- Es más simple de implementar
- Más rapido para recuperar una versión
- El código JavaScript no ocupa mucho espacio
- Si en el futuro el espacio es problema, se puede comprimir o archivar versiones viejas

**Trade-offs:**
No es un sandbox real: el script puede acceder a todo (window, document, etc.)
-  El try-catch solo captura errores, no previene código malicioso
-  Script puede hacer requests a cualquier servidor
-  Script puede inyectar código en el DOM de la página host
-  Sin validación: script puede romper la página destino
-  Sin revisión: código malicioso puede publicarse
-  Sin rollback automático: si falla, hay que borrar manualment
-  Guardar versiones completas usa más espacio que guardar diffs, pero el espacio es barato
-  Crear una versión en cada guardado puede ser mucho, quizás mejor solo al publicar o manualmente
-  Mantener muchas versiones puede hacer lenta la UI si no se pagina bien
-  IIFE protege el scope pero no protege contra código malicioso intencional
-  Try-catch captura errores pero no evita código que consume muchos recursos
-  Shadow DOM es genial pero complica la integración con elementos existentes de la página
-  Web Workers son buenos pero limitan que puedes hacer (no puedes acceder al DOM directamente)
-  Multi-tenancy añade complejidad pero es necesario para escalar
-  RLS puede ser un poco más lento que hacer los filtros en la aplicación, pero es mucho más seguro
-  Cachear scripts públicos es genial para rendimiento pero hay que invalidar la caché cuando se actualiza un script
- Rate Limiting: Hay que poner límites sino cualquiera puede hacer spam. Usaría algo como Upstash Rate Limit para limitar cuantos scripts puede crear un usuario por hora.

La verdad es que nunca vas a poder proteger al 100% contra código malicioso, pero estas medidas reducen bastante el riesgo de errores accidentales que es lo más comun.

### 4. ¿Como añadiría testing A/B real y tracking de eventos?

Esto es lo más interesante porque es literalmente la razon de ser de esta plataforma. Ahora mismo solo inyectas scripts, pero no sabes si funcionan mejor o peor.

**Arquitectura de Experimentos:**

Primero necesitaría nuevas tablas en la base de datos:

```sql
-- Tabla de experimentos A/B
CREATE TABLE experimentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'borrador', -- borrador, activo, pausado, finalizado
  fecha_inicio TIMESTAMP,
  fecha_fin TIMESTAMP,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Variantes del experimento (control, variante A, variante B, etc)
CREATE TABLE variantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experimento_id UUID REFERENCES experimentos(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL, -- 'control', 'variante_a', 'variante_b'
  script_id UUID REFERENCES scripts(id), -- null para control si no hace nada
  porcentaje_trafico INTEGER CHECK (porcentaje_trafico >= 0 AND porcentaje_trafico <= 100),
  descripcion TEXT
);

-- Tabla de tracking de eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experimento_id UUID REFERENCES experimentos(id),
  variante_id UUID REFERENCES variantes(id),
  visitor_id VARCHAR(100) NOT NULL, -- cookie anonima del usuario
  sesion_id VARCHAR(100), -- para agrupar eventos de la misma visita
  tipo_evento VARCHAR(50) NOT NULL, -- 'vista', 'click', 'conversion', 'error', etc
  metadata JSONB, -- info extra del evento
  url TEXT, -- donde paso el evento
  fecha TIMESTAMP DEFAULT NOW()
);

-- Indices para queries rapidas
CREATE INDEX idx_eventos_experimento ON eventos(experimento_id, fecha);
CREATE INDEX idx_eventos_variante ON eventos(variante_id, tipo_evento);
CREATE INDEX idx_eventos_visitor ON eventos(visitor_id);
```

**Script de Segmentación (lado del cliente):**

Cuando alguien incluye el script en su web, el script hace lo siguiente:

```javascript
(function() {
  const experimentId = 'exp_123'; // ID del experimento
  
  // Obtener o crear visitor_id (cookie anonima)
  function getVisitorId() {
    let visitorId = localStorage.getItem('ab_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36);
      localStorage.setItem('ab_visitor_id', visitorId);
    }
    return visitorId;
  }
  
  const visitorId = getVisitorId();
  const sessionId = sessionStorage.getItem('ab_session_id') || 
    's_' + Date.now() + '_' + Math.random().toString(36);
  sessionStorage.setItem('ab_session_id', sessionId);
  
  // Asignación deterministica de variante
  // Usa hash del visitor_id para que siempre le toque la misma variante
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  const hash = hashCode(visitorId + experimentId);
  const bucket = hash % 100;
  
  // Supongamos 50% control, 25% variante A, 25% variante B
  let variant = 'control';
  let variantScriptId = null;
  
  if (bucket < 50) {
    variant = 'control';
  } else if (bucket < 75) {
    variant = 'variante_a';
    variantScriptId = 'script_a_id';
  } else {
    variant = 'variante_b';
    variantScriptId = 'script_b_id';
  }
  
  // Cargar el script de la variante si hay
  if (variantScriptId) {
    const script = document.createElement('script');
    script.src = `https://tu-dominio.com/p/${variantScriptId}.js`;
    document.head.appendChild(script);
  }
  
  // Tracking automatico de vista
  fetch('https://tu-dominio.com/api/eventos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      experimentId,
      variantId: variant,
      visitorId,
      sessionId,
      evento: 'vista',
      url: window.location.href
    })
  }).catch(err => console.error('Error tracking:', err));
  
  // API publica para que el script pueda hacer tracking custom
  window.abTrack = function(evento, metadata) {
    fetch('https://tu-dominio.com/api/eventos', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        experimentId,
        variantId: variant,
        visitorId,
        sessionId,
        evento,
        metadata,
        url: window.location.href
      })
    }).catch(err => console.error('Error tracking:', err));
  };
  
  // Ejemplo de uso en el script del usuario:
  // document.querySelector('.btn-comprar').addEventListener('click', () => {
  //   window.abTrack('click_comprar', {precio: 99});
  // });
  
})();
```

**Dashboard de Resultados:**

Necesitaría una página que muestre:
- Tabla comparativa de variantes con métricas clave
- Tasa de conversion de cada variante
- Significancia estadistica (test chi-cuadrado o test t)
- Gráficos de tendencia temporal (Chart.js o Recharts)
- Embudo de conversión
- Tiempo promedio en página
- Exportar datos a CSV para analisis más profundo

**Ejemplo de query para calcular tasa de conversion:**

```sql
SELECT 
  v.nombre as variante,
  COUNT(DISTINCT CASE WHEN e.tipo_evento = 'vista' THEN e.visitor_id END) as visitas,
  COUNT(DISTINCT CASE WHEN e.tipo_evento = 'conversion' THEN e.visitor_id END) as conversiones,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN e.tipo_evento = 'conversion' THEN e.visitor_id END) / 
    NULLIF(COUNT(DISTINCT CASE WHEN e.tipo_evento = 'vista' THEN e.visitor_id END), 0),
    2
  ) as tasa_conversion
FROM variantes v
LEFT JOIN eventos e ON e.variante_id = v.id
WHERE v.experimento_id = 'exp_123'
GROUP BY v.id, v.nombre;
```

**Trade-offs y consideraciones:**

- **Privacidad:** Usar IDs anonimos y no guardar info personal. Cumplir con GDPR si hay usuarios europeos (mostrar banner de cookies)
- **Rendimiento:** El tracking no debe ralentizar la página. Usar `navigator.sendBeacon()` o requests asíncronas que no bloqueen
- **Sesgo de muestra:** Asegurar que la asignación de variantes sea realmente aleatoria y balanceada
- **Significancia estadística:** No declarar un ganador demasiado pronto, esperar a tener suficientes datos (minimo 100 conversiones por variante)
- **Contamination:** Si un usuario visita en diferentes dispositivos/navegadores, podría ver diferentes variantes. Aceptable para la mayoría de casos
- **Costo:** Guardar todos los eventos puede llenar la BD rápido. Considerar agregación diaria o archivar eventos viejos

**Mejoras adicionales:**

- Segmentación por geo, dispositivo, hora del dia
- Tests multivariantes (no solo A/B sino A/B/C/D)
- Bandits algorithm para ir ajustando el trafico automáticamente hacia la variante ganadora
- Alertas automáticas si una variante tiene muchos errores
- Integracion con Google Analytics para ver datos en contexto más amplio

---

## 🛠️ Tecnologías que usé

- **Framework:** Next.js 14 con App Router (porque es lo más moderno y funciona bien)
- **Lenguaje:** TypeScript (para evitar bugs tontos de tipos)
- **Base de Datos:** Supabase con PostgreSQL (es gratis y funciona de lujo)
- **Estilos:** Tailwind CSS (rápido de usar y queda bonito)
- **Editor:** Monaco Editor (el mismo de VS Code, no tiene sentido reinventar la rueda)
- **Notificaciones:** Sonner (para los toasts, muy simple de usar)


##  Cosas que me gustaria añadir

Hay un monton de cosas que se podrían mejorar pero por tiempo no las implementé:

- [ ] Autenticación de usuarios (con Supabase Auth)
- [ ] Versionado de scripts (para no cagarla sin poder volver atrás)
- [ ] Segmentación A/B real con tracking (esto es lo que lo haría realmente util)
- [ ] Dashboard de analytics (ver cuántas veces se ha ejecutado cada script)
- [ ] Validación de sintaxis en tiempo real (mientras escribes)
- [ ] Plantillas de scripts predefinidas (para empezar rápido)
- [ ] API rate limiting (para que no te hagan spam)
- [ ] Exportar/importar scripts (para backups)
- [ ] Colaboración en tiempo real (varios usuarios editando)
- [ ] Minificación automática de scripts publicados (para que pesen menos)



Este proyecto fue interesante de hacer. Lo más complicado fue decidir como hacer el aislamiento de los scripts para que no rompan las páginas host, porque hay mil formas de hacerlo y todas tienen sus pros y contras.

Lo que más me gustó fue integrar Monaco Editor, es literalmente tener VS Code en el navegador y funciona increiblemente bien.

Si tuviera más tiempo, definitivamente implementaría el sistema de A/B testing completo con tracking porque es la parte más interesante y lo que realmente le daría valor a la plataforma. Ahora mismo es solo un editor con persistencia, pero con A/B real sería una herramienta super potente para hacer experimentos.



