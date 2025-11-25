import '@mdi/font/css/materialdesignicons.css'
// import colors from 'vuetify/lib/util/colors'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

export default defineNuxtPlugin(app => {
  const vuetify = createVuetify({
    ssr: true,

    theme: {
      defaultTheme: 'dark',
    },

    locale: {
      locale: 'es',
      fallback: 'es',
      messages: { es },
    },
  })
  app.vueApp.use(vuetify)
})
