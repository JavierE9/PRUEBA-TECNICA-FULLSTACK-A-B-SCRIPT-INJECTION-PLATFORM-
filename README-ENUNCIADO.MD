PRUEBA TECNICA – FULLSTACK (A/B SCRIPT
INJECTION PLATFORM)

OBJETIVO
Construir una aplicacion web que permita crear, editar y publicar codigo JavaScript que pueda ser
inyectado en cualquier otra pagina web mediante un script externo.

CONTEXTO DEL PROBLEMA
Estamos construyendo una plataforma de experimentacion A/B. Un usuario debe poder escribir
codigo JS que modifique una web externa, guardarlo, publicarlo y obtener una URL unica publica.
Esa URL debe poder inyectarse en cualquier sitio mediante un script tag.

REQUISITOS FUNCIONALES
• Editor donde el usuario pueda escribir y editar codigo JavaScript.
• Boton para guardar el codigo como borrador.
• Boton para publicar que genere un identificador unico.
• Persistencia en base de datos del codigo y metadatos.
• Exponer una URL publica del tipo /p/{id}.js.
• La URL debe devolver JavaScript puro con Content-Type application/javascript.
• El script debe poder ejecutarse en cualquier dominio sin autenticacion.

PERSISTENCIA MINIMA REQUERIDA
• Codigo JavaScript.
• Fecha de creacion.
• Fecha de publicacion.
• Estado (draft / published).

REQUISITOS TECNICOS
• Preferiblemente Next.js.
• Backend API (puede estar dentro de Next.js).
• Base de datos obligatoria: Supabase (plan Free).
• Proyecto estructurado y limpio.
• README explicando decisiones tecnicas.

DOCUMENTACION REQUERIDA EN EL README
• Como escalaria la aplicacion para multiples usuarios.
• Como evitar que el script afecte negativamente a la pagina host.
• Como implementaria versionado.
• Como anadiria segmentacion A/B real y tracking de eventos.

ENTREGA
Repositorio GitHub con codigo fuente y README detallado explicando decisiones, trade-offs y
mejoras futuras.