<template>
  <v-app-bar app elevation="0" height="48" class="text-white" style="background-color: #28272d">
    <v-toolbar-title class="d-flex align-center" style="margin-inline-start: 14px" :width="200">
      <v-icon class="mr-10" @click="$emit('toggleDrawer')" >mdi-forum</v-icon>
      <span class="font-weight-bold tw-text-base">Sistema Encuestas</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-avatar size="30" color="white" class="mr-5">
      <span class="tw-text-xs">GR</span>
    </v-avatar>
  </v-app-bar>
</template>

<script setup lang="ts">
// Componente Navbar inspirado en GitLab
</script>
