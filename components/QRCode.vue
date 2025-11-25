<template>
  <div class="qr-code-container">
    <canvas ref="qrCanvas" :width="size" :height="size"></canvas>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

interface Props {
  text: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 256
})

const qrCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, props.text, {
      width: props.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).catch(err => {
      console.error('Error generating QR code:', err)
    })
  }
})

watch(() => props.text, () => {
  if (qrCanvas.value) {
    QRCode.toCanvas(qrCanvas.value, props.text, {
      width: props.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).catch(err => {
      console.error('Error generating QR code:', err)
    })
  }
})
</script>

<style scoped>
.qr-code-container {
  display: inline-block;
}
</style>