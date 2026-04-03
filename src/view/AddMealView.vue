<template>
  <div class="page-wrap">
    <div class="page-logo">PIECE BY PEAS</div>
    <div class="add-wrap">
      <img src="../assets/Bea.png" alt="Bea" class="page-bea">
      <h2 class="page-title">{{ $t('add_title') }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <label class="form-label">{{ $t('title_label') }}</label>
          <input type="text" v-model="form.title" class="form-input" :placeholder="$t('title_ph')" required>
        </div>
        <div class="form-section">
          <div class="form-row">
            <div>
              <label class="form-label">{{ $t('meal_type') }}</label>
              <select v-model="form.type" class="form-select" required>
                <option value="">{{ $t('select_type') }}</option>
                <option value="breakfast">{{ $t('breakfast') }}</option>
                <option value="lunch">{{ $t('lunch') }}</option>
                <option value="dinner">{{ $t('dinner') }}</option>
                <option value="brunch">{{ $t('brunch') }}</option>
                <option value="snack">{{ $t('snack') }}</option>
              </select>
            </div>
            <div>
              <label class="form-label">{{ $t('meal_time') }}</label>
              <input type="time" v-model="form.time" class="form-input" required>
            </div>
          </div>
        </div>
        <div class="form-section">
          <label class="form-label">{{ $t('add_tag') }}</label>
          <div class="tag-select">
            <button
              v-for="tag in tags" :key="tag.value"
              type="button"
              class="tag-option"
              :class="{ active: form.tags.includes(tag.value) }"
              @click="toggleTag(tag.value)"
            >{{ $t(tag.i18n) }}</button>
          </div>
        </div>
        <div class="form-section">
          <label class="form-label">{{ $t('included') }}</label>
          <div class="food-grid">
            <div v-for="food in foods" :key="food.value" class="food-item">
              <input type="checkbox" :id="food.value" :value="food.value" v-model="form.includes">
              <label :for="food.value" class="food-label" :class="food.value">
                <div class="food-icon">{{ food.icon }}</div>
                <span>{{ food.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$router.back()">{{ $t('cancel') }}</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? '...' : (editId ? $t('update') : $t('submit')) }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mealsApi } from '../api/index.js'

const router = useRouter()
const route = useRoute()
const editId = ref(null)
const loading = ref(false)
const error = ref('')

const form = ref({
  title: '',
  type: '',
  time: '',
  tags: [],
  includes: []
})

const tags = [
  { value: 'diet',     i18n: 'tag_diet' },
  { value: 'cheat',    i18n: 'tag_cheat' },
  { value: 'balanced', i18n: 'tag_balanced' },
  { value: 'light',    i18n: 'tag_light' },
]

const foods = [
  { value: 'grains',     icon: '🌾', label: 'Grains' },
  { value: 'protein',    icon: '🥩', label: 'Protein' },
  { value: 'vegetables', icon: '🥬', label: 'Vegetables' },
  { value: 'fruits',     icon: '🍎', label: 'Fruits' },
  { value: 'dairy',      icon: '🥛', label: 'Dairy' },
  { value: 'snacks',     icon: '🍪', label: 'Snacks' },
]

function toggleTag(tag) {
  const idx = form.value.tags.indexOf(tag)
  if (idx === -1) form.value.tags.push(tag)
  else form.value.tags.splice(idx, 1)
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    if (editId.value) {
      await mealsApi.update(editId.value, form.value)
    } else {
      await mealsApi.add(form.value)
    }
    router.push('/log')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 设置默认时间
  const now = new Date()
  form.value.time = now.toTimeString().slice(0, 5)

  // 编辑模式
  if (route.query.id) {
    editId.value = route.query.id
    const meals = await mealsApi.getAll()
    const meal = meals.find(m => m.id == editId.value)
    if (meal) {
      form.value = {
        title: meal.title,
        type: meal.type,
        time: meal.time,
        tags: meal.tags || [],
        includes: meal.includes || []
      }
    }
  }
})
</script>