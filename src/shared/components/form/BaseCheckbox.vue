<script setup lang="ts">
import Checkbox from 'primevue/checkbox'

const model = defineModel<boolean>({ default: false })

defineProps<{
  id?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
}>()
</script>

<template>
  <label class="choice choice--prime" :for="id">
    <Checkbox
      :input-id="id"
      v-model="model"
      binary
      :disabled="disabled"
      :invalid="Boolean(error)"
      :aria-invalid="Boolean(error)"
    />
    <span class="choice__content">
      <span class="field__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="hint" class="field__hint">{{ hint }}</span>
      <span v-if="error" class="field__error">{{ error }}</span>
    </span>
  </label>
</template>

<style scoped>
.choice--prime :deep(.p-checkbox) {
  margin-top: 0.12rem;
}

.choice--prime :deep(.p-checkbox-input) {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.choice--prime :deep(.p-checkbox-box) {
  display: grid;
  width: 1.18rem;
  height: 1.18rem;
  place-content: center;
  border: 1.5px solid color-mix(in srgb, var(--color-border) 88%, var(--color-text-muted));
  border-radius: 0.38rem;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 74%), rgb(255 255 255 / 18%)),
    var(--color-surface);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 64%) inset,
    0 1px 2px rgb(15 23 42 / 8%);
  transition:
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.choice--prime :deep(.p-checkbox-checked .p-checkbox-box) {
  border-color: color-mix(in srgb, var(--color-primary) 80%, white);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 84%, white), var(--color-primary));
  box-shadow:
    0 1px 0 rgb(255 255 255 / 30%) inset,
    0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.choice--prime :deep(.p-checkbox-icon) {
  width: 0.72rem;
  height: 0.72rem;
  color: white;
}
</style>
