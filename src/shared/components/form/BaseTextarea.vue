<script setup lang="ts">
import Textarea from 'primevue/textarea'

const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    rows?: number
    hint?: string
    error?: string
  }>(),
  {
    rows: 4,
  },
)
</script>

<template>
  <label class="field" :for="id">
    <span v-if="label" class="field__label">{{ label }}</span>
    <Textarea
      :id="id"
      v-model="model"
      unstyled
      class="control"
      :rows="rows"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      :aria-invalid="Boolean(error)"
    />
    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </label>
</template>
