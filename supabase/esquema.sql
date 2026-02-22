-- =====================================================
-- SQL para crear la tabla de scripts en Supabase
-- Ejecutar este script en el SQL Editor de Supabase
-- =====================================================

-- Crear la tabla de scripts
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  codigo TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado')),
  id_publico VARCHAR(20) UNIQUE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_publicacion TIMESTAMP WITH TIME ZONE
);

-- Crear índice para búsquedas por id_publico (usado para servir scripts públicos)
CREATE INDEX IF NOT EXISTS idx_scripts_id_publico ON scripts(id_publico);

-- Crear índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_scripts_estado ON scripts(estado);

-- Habilitar Row Level Security (RLS)
-- NOTA: Para este MVP deshabilitamos RLS para simplificar
-- En producción, deberías configurar políticas adecuadas
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (solo para desarrollo)
-- En producción, deberías restringir esto basándote en autenticación
CREATE POLICY "Permitir todas las operaciones en scripts" ON scripts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Función para actualizar automáticamente fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion automáticamente
DROP TRIGGER IF EXISTS trigger_actualizar_fecha ON scripts;
CREATE TRIGGER trigger_actualizar_fecha
  BEFORE UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- =====================================================
-- Datos de ejemplo (opcional)
-- =====================================================

-- INSERT INTO scripts (nombre, descripcion, codigo, estado) VALUES
-- ('Banner de Prueba', 'Un banner de prueba A/B', 'console.log("Hola desde el script A/B!");', 'borrador');
