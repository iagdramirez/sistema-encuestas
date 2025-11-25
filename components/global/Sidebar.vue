<template>
  <v-navigation-drawer
    app
    width="240"
    elevation="0"
    class="text-white"
    :permanent="smAndDown ? props.drawer : true"
    :rail="smAndUp ? props.drawer : true"
    style="background-color: #28272d; border: 0"
  >
    <v-list density="compact" nav>
      <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" class="hover:bg-[#36343a]">
        <template v-slot:prepend>
          <v-icon :icon="item.icon" class="text-white"></v-icon>
        </template>
        <v-list-item-title class="text-white">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown, smAndUp } = useDisplay()

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
})

const menuItems = [
  { title: 'Home', icon: 'mdi-home', to: '/' },
  //   { title: 'Projects', icon: 'mdi-folder-multiple', to: '/projects' },
  //   { title: 'Groups', icon: 'mdi-account-group', to: '/groups' },
  //   { title: 'Admin', icon: 'mdi-shield-account', to: '/admin' },
  //   { title: 'Settings', icon: 'mdi-cog', to: '/settings' },
]
</script>
