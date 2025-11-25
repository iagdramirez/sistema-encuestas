<template>
  <div
    v-if="error.statusCode == 404"
    class="tw-relative ff-nunito tw-flex tw-items-center tw-justify-center tw-h-screen tw-flex-col md:tw-flex-row-reverse tw-px-10 md:tw-px-5"
  >
    <div>
      <p class="tw-text-lg tw-mb-4">Error 404.</p>
    </div>
  </div>
  <div
    v-else
    class="tw-relative ff-nunito tw-flex tw-items-center tw-justify-center tw-h-screen tw-flex-col md:tw-flex-row-reverse tw-px-10 md:tw-px-5"
  >
    <div>
      <p class="tw-text-lg tw-mb-4">Ha ocurrido un error.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['error'])
</script>

<style lang="scss">
/*  */
</style>
