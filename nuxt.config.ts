import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const {
  //********** Configuración de Servicios **********//
  APP_PORT = 6985,
} = process.env

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  devServer: {
    port: +APP_PORT,
  },

  // SEO and Meta: https://nuxt.com/docs/getting-started/seo-meta
  app: {
    head: {
      titleTemplate: '%s',
      title: 'Sistema Inventario',
      htmlAttrs: {
        lang: 'es',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Sistema Inventario' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  // Variables de Entorno para el servidor y el cliente.
  runtimeConfig: {
    //

    public: {
      // Import env here...
    },
  },

  css: ['animate.css'],

  plugins: [
    // Import plugins here...
  ],

  // https://nuxt.com/docs/guide/directory-structure/components
  components: true,

  modules: [
    // https://pinia.vuejs.org/ssr/nuxt.html
    '@pinia/nuxt',

    // https://nuxt.com/modules/tailwindcss
    '@nuxtjs/tailwindcss',

    // https://vuetifyjs.com/en/getting-started/installation/#using-nuxt-3
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  pinia: {
    storesDirs: ['./store/**'],
  },

  // Tailwind module options: https://nuxt.com/modules/tailwindcss
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {
      //
    },
  },

  //! The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
  vite: {
    server: {
      allowedHosts: ['nuxt'],
    },

    vue: {
      template: {
        transformAssetUrls,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables.scss" as *;',
        },
      },
    },
  },

  build: {
    transpile: ['vuetify'],
  },
})
