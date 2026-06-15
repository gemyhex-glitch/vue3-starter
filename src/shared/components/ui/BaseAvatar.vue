<script setup lang="ts">
import { computed } from 'vue'
import Avatar from 'primevue/avatar'

const props = defineProps<{
  name: string
  src?: string
}>()

const initials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)
</script>

<template>
  <Avatar class="avatar" :label="src ? undefined : initials" :image="src" shape="circle" :aria-label="name" />
</template>

<style scoped>
.avatar {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 800;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
