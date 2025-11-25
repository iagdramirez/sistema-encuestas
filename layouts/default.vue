<template>
  <v-app class="!tw-bg-[#28272d]">
    <Navbar @toggleDrawer="() => toggleDrawer()" />

    <Sidebar :drawer="drawer" />

    <v-main elevation="0" class="tw-min-h-screen">
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(false)

const toggleDrawer = () => (drawer.value = !drawer.value)

import Navbar from '@/components/global/Navbar.vue'
import Sidebar from '@/components/global/Sidebar.vue'
</script>
