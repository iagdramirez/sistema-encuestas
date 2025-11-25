module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],

  prefix: 'tw-',

  corePlugins: {
    preflight: false,
  },

  theme: {},

  plugins: [],
}
