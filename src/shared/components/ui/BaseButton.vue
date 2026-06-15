<script setup lang="ts">
import Button from 'primevue/button'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    iconOnly?: boolean
    iconPosition?: 'start' | 'end'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    iconOnly: false,
    iconPosition: 'start',
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    unstyled
    class="base-button"
    :class="[
      `base-button--${props.variant}`,
      `base-button--${props.size}`,
      `base-button--icon-${props.iconPosition}`,
      {
        'base-button--icon-only': props.iconOnly,
        'base-button--loading': props.loading,
      },
    ]"
    :type="props.type"
    :disabled="props.disabled || props.loading"
    @click="$emit('click', $event)"
  >
    <span v-if="props.loading" class="base-button__loader" aria-hidden="true"></span>

    <template v-if="props.iconOnly">
      <slot v-if="!props.loading" name="icon" />
      <slot v-if="!props.loading && !$slots.icon" />
    </template>

    <template v-else>
      <span v-if="$slots.icon && props.iconPosition === 'start' && !props.loading" class="base-button__icon">
        <slot name="icon" />
      </span>
      <span class="base-button__label">
        <slot />
      </span>
      <span v-if="$slots.icon && props.iconPosition === 'end' && !props.loading" class="base-button__icon">
        <slot name="icon" />
      </span>
    </template>
  </Button>
</template>
