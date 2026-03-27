<template>
  <NavBar v-if="showNav" />
  <div :class="showNav ? 'main-content' : ''">
    <RouterView />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
const showNav = computed(() => !['login', 'register'].includes(route.name))
</script>