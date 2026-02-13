# Diagrama de Base de Datos - Integridad desde la Raíz

Este documento describe el esquema de base de datos relacional propuesto para la aplicación, basado en las estructuras de datos actuales (JSON) y las necesidades funcionales de cada página (`cine.html`, `eventos.html`, `material.html`, `index.html`).

## Diagrama Entidad-Relación (Mermaid)

```mermaid
erDiagram
    ESTADOS ||--o{ REDES_SOCIALES : tiene
    ESTADOS ||--o{ EVENTOS : organiza
    ESTADOS ||--o{ MATERIALES : publica
    ESTADOS ||--o{ VIDEOS_CINE : produce

    EVENTOS ||--o{ GALERIA_EVENTOS : contiene
    EVENTOS ||--o{ MOMENTOS_EVENTOS : destaca
    SLIDERS ||--o{ SLIDER_BOTONES : contiene

    ESTADOS {
        int id PK
        string nombre "Ej: Puebla, Hidalgo"
        string slug "Ej: puebla, hidalgo"
        string url_logo
        string url_sitio
    }

    REDES_SOCIALES {
        int id PK
        int estado_id FK
        string plataforma "facebook, instagram, youtube, etc."
        string url
    }

    SLIDERS {
        int id PK
        string tipo "simple | complejo"
        string titulo
        string descripcion
        string url_imagen
        string gradiente_fondo
        int orden
        boolean activo
    }

    SLIDER_BOTONES {
        int id PK
        int slider_id FK
        string texto
        string url
        string icono
        string estilo
        string video_src
    }

    VIDEOS_CINE {
        int id PK
        int estado_id FK
        string tipo_fuente "youtube | local"
        string youtube_id
        string titulo
        string descripcion
        string hashtag
        string url_video
        string url_poster
        string cta_url
    }

    EVENTOS {
        int id PK
        string slug "Ej: rally-puebla-2025"
        boolean visible_inicio
        string badge_inicio
        string titulo
        string descripcion
        date fecha
        string ubicacion
        int estado_id FK
        string imagen_principal
        string url_video
        string texto_impacto
        string texto_pilares_count
        string decoracion_top_left
        string decoracion_bottom_right
    }

    GALERIA_EVENTOS {
        int id PK
        int evento_id FK
        string url_imagen
        string tipo "foto | banner"
    }

    MOMENTOS_EVENTOS {
        int id PK
        int evento_id FK
        string url_imagen
        string titulo
        string anio_texto
        boolean margin_top
    }

    MATERIALES {
        int id PK
        string titulo
        string descripcion
        string tipo_archivo "PDF, JPG, ZIP, MP4"
        string categoria
        string tamano_archivo
        int estado_id FK
        string url_descarga
    }

    USUARIOS {
        int id PK
        string correo UK
        string pass "hash bcrypt"
        date creado_en
    }
```

## Diccionario de Datos

### 1. Entidades Principales

#### `ESTADOS` (Estados)
Catálogo de estados participantes en el proyecto.
- **id**: Identificador único.
- **nombre**: Nombre legible (Ej: "Puebla").
- **slug**: Identificador para URLs y filtros (Ej: "puebla").
- **url_logo / url_sitio**: Datos para la barra de estados en Inicio.

#### `USUARIOS` (Acceso al Admin)
Tabla usada por el login de administración (`login.php`).
- **correo**: Identificador único (usuario).
- **pass**: Hash con `password_hash()` (verifica con `password_verify()`).

#### `VIDEOS_CINE` (Cine)
Unifica los datos de:
- **Inicio (index.html)**: tarjetas por estado con video local + poster.
- **cine.html**: listado de videos YouTube filtrable por estado.

Campos clave:
- **tipo_fuente**: `local` o `youtube`.
- **youtube_id**: Solo si `tipo_fuente = youtube`.
- **url_video / url_poster**: Solo si `tipo_fuente = local`.
- **estado_id**: Relación con el estado.

#### `EVENTOS` (Eventos)
Unifica los datos de:
- **Inicio (index.html)**: “Último Evento” (usa `visible_inicio` y `badge_inicio`).
- **eventos.html + detalle_evento.html**: listado y detalle.

Campos clave:
- **slug**: Identificador estable usado en `detalle_evento.html?id=<slug>`.
- **texto_impacto / texto_pilares_count**: métricas que se muestran en el detalle.

### 2. Tablas Auxiliares de Eventos
Para normalizar listas:
- **`GALERIA_EVENTOS`**: Fotos del evento y/o banners roll-up, diferenciados por `tipo` (`foto` / `banner`).
- **`MOMENTOS_EVENTOS`**: Galería “Momentos Inolvidables” (título/año/imagen) que hoy existe como dataset adicional.

#### `MATERIALES` (Materiales)
Repositorio de archivos descargables en `material.html`.
- **tipo_archivo**: Tipo de archivo para mostrar badges correctos.
- **tamano_archivo**: Texto libre (Ej: `4.2 MB`).
- **url_descarga**: Ruta/URL del archivo.

#### `SLIDERS` (Inicio)
Controla los slides del carrusel en `index.html` (con botones en `SLIDER_BOTONES`).
- **orden**: Para ordenar la secuencia de los slides.
- **gradiente_fondo**: Permite fondos personalizados o degradados complejos.
- **activo**: Habilita/deshabilita el slide sin borrarlo.
