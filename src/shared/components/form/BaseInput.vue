<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'

const model = defineModel<string | number>({ default: '' })

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'search'
    placeholder?: string
    hint?: string
    error?: string
    ariaLabel?: string
    autocomplete?: string
    disabled?: boolean
    required?: boolean
    iconPosition?: 'start' | 'end'
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
    autocomplete: 'off',
    iconPosition: 'start',
  },
)

const inputValue = computed({
  get: () => String(model.value ?? ''),
  set: (value: string) => {
    model.value = props.type === 'number' && value !== '' ? Number(value) : value
  },
})
</script>

<template>
  <label class="field" :for="id">
    <span v-if="label" class="field__label">{{ label }}</span>
    <span class="input-control" :class="`input-control--icon-${iconPosition}`">
      <span v-if="$slots.icon" class="input-control__icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <InputText
        :id="id"
        v-model="inputValue"
        unstyled
        class="control"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel || label"
        :invalid="Boolean(error)"
        :aria-invalid="Boolean(error)"
        :aria-describedby="hint || error ? `${id}-support` : undefined"
      />
    </span>
    <p v-if="error" :id="`${id}-support`" class="field__error">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-support`" class="field__hint">{{ hint }}</p>
  </label>
</template>

<style scoped>
.input-control {
  position: relative;
  display: block;
}

.input-control__icon {
  position: absolute;
  top: 50%;
  display: inline-grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-surface-muted) 76%, transparent);
  color: var(--color-text-muted);
  transform: translateY(-50%);
  transition:
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
}

.input-control__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.input-control--icon-start .input-control__icon {
  inset-inline-start: var(--space-3);
}

.input-control--icon-end .input-control__icon {
  inset-inline-end: var(--space-3);
}

.input-control--icon-start:has(.input-control__icon) .control {
  padding-inline-start: 2.95rem;
}

.input-control--icon-end:has(.input-control__icon) .control {
  padding-inline-end: 2.95rem;
}

.input-control:focus-within .input-control__icon {
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.input-control:has(.control[aria-invalid='true']) .input-control__icon {
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
  color: var(--color-danger);
}
</style>
