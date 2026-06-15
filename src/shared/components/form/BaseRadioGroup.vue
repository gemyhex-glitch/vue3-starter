<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'
import type { SelectOption } from '@shared/types/form'

const model = defineModel<string | number>({ default: '' })

defineProps<{
  label: string
  name: string
  options: SelectOption[]
  error?: string
}>()
</script>

<template>
  <fieldset class="field">
    <legend class="field__label">{{ label }}</legend>
    <label v-for="option in options" :key="option.value" class="choice choice--prime">
      <RadioButton v-model="model" :name="name" :value="option.value" />
      <span class="choice__content">
        <span class="field__label">{{ option.label }}</span>
      </span>
    </label>
    <p v-if="error" class="field__error">{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.choice--prime :deep(.p-radiobutton) {
  margin-top: 0.12rem;
}

.choice--prime :deep(.p-radiobutton-input) {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.choice--prime :deep(.p-radiobutton-box) {
  display: grid;
  width: 1.18rem;
  height: 1.18rem;
  place-content: center;
  border: 1.5px solid color-mix(in srgb, var(--color-border) 88%, var(--color-text-muted));
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 74%), rgb(255 255 255 / 18%)),
    var(--color-surface);
}

.choice--prime :deep(.p-radiobutton-checked .p-radiobutton-box) {
  border-color: color-mix(in srgb, var(--color-primary) 80%, white);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 84%, white), var(--color-primary));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.choice--prime :deep(.p-radiobutton-icon) {
  width: 0.58rem;
  height: 0.58rem;
  background: white;
}
</style>
