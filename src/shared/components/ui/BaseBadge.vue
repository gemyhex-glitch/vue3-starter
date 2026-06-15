<script setup lang="ts">
import Badge from 'primevue/badge'

withDefaults(
  defineProps<{
    variant?: 'success' | 'warning' | 'danger' | 'info'
  }>(),
  {
    variant: 'info',
  },
)
</script>

<template>
  <Badge class="badge" :class="`badge--${variant}`">
    <slot />
  </Badge>
</template>
