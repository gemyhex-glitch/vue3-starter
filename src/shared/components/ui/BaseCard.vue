<script setup lang="ts">
import Card from 'primevue/card'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <Card class="card">
    <template v-if="title" #title>
      <h2 class="card__title">{{ title }}</h2>
    </template>
    <template v-if="description" #subtitle>
      <p class="card__description">{{ description }}</p>
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>
