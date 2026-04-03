<template>
  <div class="page-wrap">
    <div class="page-logo">PIECE BY PEAS</div>
    <div class="log-wrap">
      <img src="../assets/Bea.png" alt="Bea" class="page-bea">
      <div class="date-nav">
        <button class="date-nav-btn" @click="changeDay(-1)">&#8249;</button>
        <div class="date-center">
          <div class="date-main">{{ dateLabel }}</div>
          <div class="date-sub">{{ dateSubLabel }}</div>
        </div>
        <button class="date-nav-btn" @click="changeDay(1)" :disabled="offset === 0">&#8250;</button>
      </div>
      <div class="tab-row">
        <button class="tab-btn" :class="{ active: tab === 'today' }" @click="tab = 'today'">{{ $t('today') }}</button>
        <button class="tab-btn" :class="{ active: tab === 'history' }" @click="tab = 'history'">{{ $t('history') }}</button>
      </div>

      <!-- Today Tab -->
      <div v-if="tab === 'today'">
        <p class="section-label">{{ dayMeals.length }} {{ $t('meals_recorded') }}</p>
        <div v-if="dayMeals.length === 0" class="no-meals">
          <p>{{ $t('no_meals') }}</p>
          <button class="btn-primary" @click="$router.push('/add')">{{ $t('add_first') }}</button>
        </div>
        <div v-for="meal in dayMeals" :key="meal.id" class="meal-card">
          <div class="meal-card-header">
            <div>
              <div class="meal-title">{{ meal.title }}</div>
              <div class="meal-meta">{{ meal.type }} · {{ meal.time }}</div>
            </div>
            <div class="meal-actions">
              <button class="btn-icon" @click="editMeal(meal)">✏️</button>
              <button class="btn-icon" @click="deleteMeal(meal.id)">🗑️</button>
            </div>
          </div>
          <div class="meal-tags" v-if="meal.tags?.length">
            <span v-for="tag in meal.tags" :key="tag" class="meal-tag">{{ tag }}</span>
          </div>
          <div class="meal-includes" v-if="meal.includes?.length">
            <span v-for="item in meal.includes" :key="item" class="include-badge">{{ item }}</span>
          </div>
        </div>
        <div class="suggestions-box" v-if="dayMeals.length > 0">
          <p class="section-label">{{ $t('suggestions_title') }}</p>
          <p v-if="missedGroups.length === 0">{{ $t('all_groups') }}</p>
          <p v-for="group in missedGroups" :key="group">{{ $t('tip_' + group) }}</p>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="tab === 'history'">
        <p class="section-label">{{ $t('recent_history') }}</p>
        <div v-for="(group, date) in historyGroups" :key="date" class="history-group">
          <p class="history-date">{{ date }}</p>
          <div v-for="meal in group" :key="meal.id" class="meal-card">
            <div class="meal-title">{{ meal.title }}</div>
            <div class="meal-meta">{{ meal.type }} · {{ meal.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mealsApi } from '../api/index.js'

const router = useRouter()
const meals = ref([])
const tab = ref('today')
const offset = ref(0)

const ALL_GROUPS = ['grains', 'protein', 'vegetables', 'fruits', 'dairy', 'snacks']

function getDateStr(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const dateLabel = computed(() => {
  if (offset.value === 0) return 'Today'
  if (offset.value === -1) return 'Yesterday'
  return getDateStr(offset.value)
})

const dateSubLabel = computed(() => getDateStr(offset.value))

const dayMeals = computed(() => {
  const target = getDateStr(offset.value)
  return meals.value.filter(m => m.created_at?.slice(0, 10) === target)
})

const missedGroups = computed(() => {
  const covered = new Set(dayMeals.value.flatMap(m => m.includes || []))
  return ALL_GROUPS.filter(g => !covered.has(g))
})

const historyGroups = computed(() => {
  const groups = {}
  meals.value.forEach(m => {
    const date = m.created_at?.slice(0, 10) || 'Unknown'
    if (!groups[date]) groups[date] = []
    groups[date].push(m)
  })
  return groups
})

function changeDay(delta) {
  const next = offset.value + delta
  if (next <= 0) offset.value = next
}

function editMeal(meal) {
  router.push(`/add?id=${meal.id}`)
}

async function deleteMeal(id) {
  if (!confirm('Delete this meal?')) return
  await mealsApi.delete(id)
  meals.value = meals.value.filter(m => m.id !== id)
}

onMounted(async () => {
  meals.value = await mealsApi.getAll()
})
</script>