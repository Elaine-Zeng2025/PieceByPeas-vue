<template>
  <div class="page-wrap">
    <div class="page-logo">PIECE BY PEAS</div>
    <div class="report-wrap">
      <img src="../assets/Bea.png" alt="Bea" class="page-bea">
      <div class="period-tabs">
        <button class="period-tab" :class="{ active: period === 'month' }" @click="period = 'month'">{{ $t('this_month') }}</button>
        <button class="period-tab" :class="{ active: period === 'week' }" @click="period = 'week'">{{ $t('this_week') }}</button>
        <button class="period-tab" :class="{ active: period === 'custom' }" @click="period = 'custom'">{{ $t('last_7') }}</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">{{ $t('days_covered') }}</div><div class="stat-value">{{ stats.days }}</div></div>
        <div class="stat-card"><div class="stat-label">{{ $t('avg_meals') }}</div><div class="stat-value">{{ stats.avg }}</div></div>
        <div class="stat-card"><div class="stat-label">{{ $t('most_consumed') }}</div><div class="stat-value">{{ stats.top }}</div></div>
        <div class="stat-card"><div class="stat-label">{{ $t('most_missing') }}</div><div class="stat-value warning">{{ stats.missing }}</div></div>
      </div>
      <div class="chart-legend">
        <div class="legend-item" v-for="g in groups" :key="g.key">
          <div class="legend-dot" :style="{ background: g.color }"></div>{{ g.label }}
        </div>
      </div>
      <div class="chart-block">
        <div class="chart-title">Nutrition coverage radar</div>
        <div style="position:relative;width:100%;height:220px">
          <Radar v-if="radarData" :data="radarData" :options="chartOptions" />
        </div>
      </div>
      <div class="chart-block">
        <div class="chart-title">Meal type distribution</div>
        <div style="position:relative;width:100%;height:180px">
          <Doughnut v-if="donutData" :data="donutData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Radar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend } from 'chart.js'
import { mealsApi } from '../api/index.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ArcElement, Tooltip, Legend)

const meals = ref([])
const period = ref('week')

const groups = [
  { key: 'grains',     label: 'Grains',     color: '#f0945d' },
  { key: 'protein',    label: 'Protein',    color: '#EF82A0' },
  { key: 'vegetables', label: 'Vegetables', color: '#6bb392' },
  { key: 'fruits',     label: 'Fruits',     color: '#ffd970' },
  { key: 'dairy',      label: 'Dairy',      color: '#88abda' },
  { key: 'snacks',     label: 'Snacks',     color: '#dcc7e1' },
]

const chartOptions = { responsive: true, maintainAspectRatio: false }

const filteredMeals = computed(() => {
  const now = new Date()
  return meals.value.filter(m => {
    const d = new Date(m.created_at)
    if (period.value === 'week') {
      const start = new Date(now); start.setDate(now.getDate() - now.getDay())
      return d >= start
    }
    if (period.value === 'month') return d.getMonth() === now.getMonth()
    // last 7
    const start = new Date(now); start.setDate(now.getDate() - 7)
    return d >= start
  })
})

const stats = computed(() => {
  const fm = filteredMeals.value
  const days = new Set(fm.map(m => m.created_at?.slice(0, 10))).size
  const avg = days ? (fm.length / days).toFixed(1) : '—'
  const counts = {}
  fm.forEach(m => (m.includes || []).forEach(g => counts[g] = (counts[g] || 0) + 1))
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = sorted[0]?.[0] || '—'
  const allGroups = ['grains','protein','vegetables','fruits','dairy','snacks']
  const missing = allGroups.filter(g => !counts[g])[0] || '—'
  return { days, avg, top, missing }
})

const radarData = computed(() => ({
  labels: groups.map(g => g.label),
  datasets: [{
    label: 'Coverage',
    data: groups.map(g => filteredMeals.value.filter(m => m.includes?.includes(g.key)).length),
    backgroundColor: 'rgba(107,179,146,0.2)',
    borderColor: '#6bb392',
  }]
}))

const donutData = computed(() => {
  const types = {}
  filteredMeals.value.forEach(m => types[m.type] = (types[m.type] || 0) + 1)
  return {
    labels: Object.keys(types),
    datasets: [{ data: Object.values(types), backgroundColor: ['#f0945d','#EF82A0','#6bb392','#ffd970','#88abda'] }]
  }
})

onMounted(async () => {
  meals.value = await mealsApi.getAll()
})
</script>