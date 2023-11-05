<template>
  <v-app>
    <v-main class="app-main">
      <router-view/>
    </v-main>
  </v-app>
</template>


<script setup>
  import { onMounted } from 'vue'
  import {usePlatformStore} from './stores/platform'
  const platform_store = usePlatformStore()
  const {fit_screen} = platform_store
  import store from './store'



 
  onMounted(async() => {
    fit_screen()
  })
</script>

<style lang="scss">
 
 .app-main{
    position: relative;
    width: 100%;
    height: calc(calc(var(--vh, 1vh) * 100));
 }
 .app-reload{
    background: $darken;
  }
</style>