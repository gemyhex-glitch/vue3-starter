<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import type { SelectOption } from '@shared/types/form'

const model = defineModel<string | number>({ default: '' })

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    options: SelectOption[]
    placeholder?: string
    hint?: string
    error?: string
    ariaLabel?: string
    disabled?: boolean
    required?: boolean
    placeholderDisabled?: boolean
  }>(),
  {
    placeholder: '',
    disabled: false,
    required: false,
    placeholderDisabled: true,
  },
)
const { t } = useI18n()
const resolvedPlaceholder = computed(() => props.placeholder || t('form.selectOption'))
</script>

<template>
  <label class="field" :for="id">
    <span v-if="label" class="field__label">{{ label }}</span>
    <Select
      :input-id="id"
      v-model="model"
      class="control select-control"
      :options="placeholderDisabled ? options : [{ label: resolvedPlaceholder, value: '' }, ...options]"
      option-label="label"
      option-value="value"
      :placeholder="resolvedPlaceholder"
      :disabled="disabled"
      :invalid="Boolean(error)"
      :aria-label="ariaLabel || label"
      :aria-invalid="Boolean(error)"
      :aria-required="required"
    />
    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </label>
</template>

<style scoped>
.select-control {
  display: flex;
  align-items: center;
  padding: 0;
}

.select-control :deep(.p-select-label) {
  flex: 1 1 auto;
  padding: 0.62rem 0.85rem;
  color: var(--color-text);
}

.select-control :deep(.p-select-label.p-placeholder) {
  color: color-mix(in srgb, var(--color-text-muted) 82%, transparent);
}

.select-control :deep(.p-select-dropdown) {
  width: 2.7rem;
  color: var(--color-text-muted);
}

.select-control:hover :deep(.p-select-dropdown),
.select-control:focus-within :deep(.p-select-dropdown) {
  color: var(--color-primary);
}
</style>
