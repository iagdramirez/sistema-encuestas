# Sistema de Encuestas

Un sistema completo de encuestas construido con Nuxt 4, Vue 3, TypeScript, TailwindCSS, Vuetify y Supabase.

## 🚀 Características

- ✅ **CRUD completo de encuestas**: Crear, listar, editar y eliminar encuestas
- ✅ **Tres tipos de preguntas**: Sí/No, Texto libre, Selección múltiple
- ✅ **Enlaces públicos únicos**: Cada encuesta tiene un slug único y enlace público
- ✅ **Generación de QR codes**: Para compartir fácilmente las encuestas
- ✅ **Interfaz responsive**: Diseño moderno con TailwindCSS y Vuetify
- ✅ **Base de datos Supabase**: Almacenamiento seguro y escalable
- ✅ **TypeScript**: Tipado completo para mejor desarrollo
- ✅ **Sin autenticación**: Enfoque en simplicidad

## 🛠️ Tecnologías

- **Nuxt 4** - Framework Vue.js full-stack
- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - JavaScript con tipos
- **TailwindCSS 4** - Framework CSS utilitario
- **Vuetify 3** - Componentes Material Design para Vue
- **Pinia** - Gestión de estado para Vue
- **Supabase** - Base de datos PostgreSQL como servicio

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sistema-encuestas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ir a Settings > API para obtener las credenciales
3. Ejecutar el esquema SQL en el SQL Editor de Supabase (ver `schema.sql`)

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor de desarrollo
APP_PORT=6985

# URL de la aplicación (para generar enlaces)
APP_URL=http://localhost:6985

# Credenciales de Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:6985`

## 📁 Estructura del Proyecto

```
├── components/           # Componentes Vue reutilizables
│   ├── QRCode.vue       # Componente para generar QR codes
│   └── global/          # Componentes globales
├── pages/               # Páginas de Nuxt (file-based routing)
│   ├── index.vue        # Página principal (CRUD de encuestas)
│   ├── encuestas/
│   │   └── [id].vue     # Página de edición de encuesta
│   └── s/
│       └── [slug].vue   # Página pública para responder encuestas
├── store/               # Stores de Pinia
│   ├── useSurveyStore.ts
│   ├── useQuestionStore.ts
│   └── useResponseStore.ts
├── interfaces/          # Tipos TypeScript
├── plugins/             # Plugins de Nuxt
├── composables/         # Composables reutilizables
├── server/              # API routes del servidor
└── schema.sql           # Esquema de base de datos
```

## 🎯 Uso

### Crear una encuesta

1. Ir a la página principal
2. Hacer clic en "Nueva Encuesta"
3. Ingresar título y descripción
4. Hacer clic en "Crear"

### Agregar preguntas

1. Ir a la página de edición de la encuesta
2. Hacer clic en "Agregar Pregunta"
3. Seleccionar tipo de pregunta
4. Configurar opciones (para selección múltiple)

### Compartir la encuesta

1. En la página principal, hacer clic en "Copiar enlace" o "QR"
2. Compartir el enlace público `/s/[slug]` con los participantes

### Responder una encuesta

1. Acceder al enlace público
2. Responder todas las preguntas
3. Hacer clic en "Enviar respuestas"

## 🗄️ Esquema de Base de Datos

El proyecto incluye un esquema completo de PostgreSQL con las siguientes tablas:

- `surveys` - Encuestas
- `survey_questions` - Preguntas de las encuestas
- `survey_options` - Opciones para preguntas múltiples
- `survey_responses` - Respuestas a encuestas
- `survey_response_answers` - Respuestas individuales

Ver `schema.sql` para el esquema completo.

## 🚀 Despliegue

### Build para producción

```bash
npm run build
```

### Preview local

```bash
npm run preview
```

### Despliegue en Vercel/Netlify

1. Conectar el repositorio
2. Configurar las variables de entorno
3. Ejecutar el build

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.
