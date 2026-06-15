<script setup lang="ts">
import Password from 'primevue/password'

const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    autocomplete?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    disabled: false,
    required: false,
    autocomplete: 'new-password',
  },
)
</script>

<template>
  <label class="field" :for="id">
    <span v-if="label" class="field__label">{{ label }}</span>
    <Password
      :id="id"
      v-model="model"
      input-class="control"
      :input-props="{
        required,
        autocomplete,
        'aria-invalid': Boolean(error),
        'aria-describedby': hint || error ? `${id}-support` : undefined,
      }"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="Boolean(error)"
      toggle-mask
      :feedback="false"
      fluid
      class="password-control"
    />
    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </label>
</template>

<style scoped>
.password-control :deep(.p-password-input) {
  width: 100%;
  padding-inline-end: 3rem;
}

.password-control :deep(.p-password-toggle-mask-icon) {
  inset-inline-end: 0.9rem;
  color: var(--color-text-muted);
}

.password-control :deep(.p-password-toggle-mask-icon:hover) {
  color: var(--color-primary);
}
</style>
