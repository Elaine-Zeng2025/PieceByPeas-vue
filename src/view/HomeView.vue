<template>
  <div class="page-wrap">
    <div class="page-logo">PIECE BY PEAS</div>
    <div class="home-hero">
      <h1 class="main-title">{{ greeting }}</h1>
    </div>
    <div class="home-cards">
      <button class="home-card" @click="$router.push('/add')">{{ $t('add_meal') }}</button>
      <div class="home-cards-row">
        <button class="home-card" @click="$router.push('/log')">{{ $t('view_log') }}</button>
        <button class="home-card" @click="$router.push('/report')">{{ $t('report') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return t('greeting_morning')
  if (hour < 17) return t('greeting_afternoon')
  return t('greeting_evening')
})
</script>