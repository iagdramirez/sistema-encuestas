<!-- Original Author: https://github.com/yisibell -->
<!-- Source: https://github.com/yisibell/nuxt-svg-icons/blob/main/src/runtime/components/nuxt-svg-icon.vue -->
<!-- Modified by Gerardo Ramírez -->

<template>
  <span class="nuxt-svg" :style="[styleVars]" v-html="icon" />
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'NuxtSVG',

  props: {
    name: { type: String, required: true },
    fill: { type: String, default: undefined },
    color: { type: String, default: undefined },
    stroke: { type: String, default: undefined },
    fillOpacity: { type: String, default: undefined },
    strokeOpacity: { type: String, default: undefined },
    width: { type: [String, Number], default: undefined },
    heigth: { type: [String, Number], default: undefined },
  },

  data: () => ({
    icon: '',
  }),

  computed: {
    styleVars() {
      const customColor = this.fill || this.color
      const customWidth = typeof this.width === 'number' ? `${this.width}px` : this.width
      const customHeigth = typeof this.heigth === 'number' ? `${this.heigth}px` : this.heigth

      return {
        '--nuxt-svg-width': customWidth,
        '--nuxt-svg-height': customHeigth,

        '--nuxt-svg-fill': customColor,
        '--nuxt-svg-fill-opacity': this.fillOpacity,

        '--nuxt-svg-stroke': this.stroke,
        '--nuxt-svg-stroke-opacity': this.strokeOpacity,
      }
    },
  },

  watch: {
    name: {
      immediate: true,
      async handler(data) {
        try {
          const iconsImport = import.meta.glob<string>('assets/svg/**/**.svg', {
            eager: false,
            query: '?raw',
            import: 'default',
          })

          const rawIcon: string = await iconsImport[`/assets/svg/${this.name}.svg`]()
          this.icon = rawIcon
        } catch {
          console.error(`[NuxtSVG] Icon '${this.name}' doesn't exist in 'assets/svg'`)
        }
      },
    },
  },
})
</script>

<style lang="scss">
.nuxt-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nuxt-svg svg {
  width: var(--nuxt-svg-width) !important;
  height: var(--nuxt-svg-height) !important;

  fill: var(--nuxt-svg-fill) !important;
  fill-opacity: var(--nuxt-svg-fill-opacity) !important;

  stroke: var(--nuxt-svg-stroke) !important;
  stroke-opacity: var(--nuxt-svg-stroke-opacity) !important;
}
</style>
