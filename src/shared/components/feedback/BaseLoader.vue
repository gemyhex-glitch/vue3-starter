<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressSpinner from 'primevue/progressspinner'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    label?: string
    description?: string
    variant?: 'inline' | 'panel'
  }>(),
  {
    size: 'md',
    label: '',
    description: '',
    variant: 'inline',
  },
)
const { t } = useI18n()
const resolvedLabel = computed(() => props.label || t('common.loading'))
</script>

<template>
  <span
    class="base-loader"
    :class="[`base-loader--${size}`, `base-loader--${variant}`]"
    role="status"
    :aria-label="resolvedLabel"
  >
    <span class="base-loader__mark" aria-hidden="true">
      <ProgressSpinner class="base-loader__spinner" stroke-width="3" />
      <img src="/favicon.svg" alt="" />
    </span>
    <span v-if="variant === 'panel'" class="base-loader__copy">
      <strong>{{ resolvedLabel }}</strong>
      <small v-if="description">{{ description }}</small>
    </span>
  </span>
</template>

<style scoped>
.base-loader {
  --loader-size: 1.5rem;
  --loader-ring: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  vertical-align: middle;
}

.base-loader--panel {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  width: min(100%, 26rem);
  padding: var(--space-8) var(--space-6);
  margin: 0 auto;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 94%, transparent), color-mix(in srgb, var(--color-surface-muted) 72%, transparent)),
    radial-gradient(circle at 50% 0, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 56%);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 58%) inset,
    0 18px 46px rgb(15 23 42 / 10%);
  color: var(--color-text);
  text-align: center;
}

:root.dark .base-loader--panel {
  box-shadow:
    0 1px 0 rgb(255 255 255 / 8%) inset,
    0 18px 46px rgb(0 0 0 / 24%);
}

.base-loader__mark {
  position: relative;
  display: grid;
  width: var(--loader-size);
  height: var(--loader-size);
  place-items: center;
  isolation: isolate;
  animation: loader-breathe 1.7s ease-in-out infinite;
}

.base-loader__mark::before,
.base-loader__mark::after {
  position: absolute;
  pointer-events: none;
  content: '';
}

.base-loader__mark::before {
  inset: calc(var(--loader-ring) * -2.5);
  z-index: -1;
  border-radius: 999px;
  background:
    conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--color-primary) 72%, white), #47bfff, transparent 78%),
    color-mix(in srgb, var(--color-primary) 12%, transparent);
  filter: blur(0.2px);
  opacity: 0.88;
  animation: loader-orbit 1.05s linear infinite;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--loader-ring) - 1px), #000 calc(100% - var(--loader-ring)));
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--loader-ring) - 1px), #000 calc(100% - var(--loader-ring)));
}

.base-loader__mark::after {
  inset: 10%;
  z-index: -1;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 28%, transparent);
  filter: blur(10px);
  opacity: 0.68;
  animation: loader-glow 1.7s ease-in-out infinite;
}

.base-loader__mark img {
  position: relative;
  z-index: 1;
  width: 74%;
  height: 74%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 8px color-mix(in srgb, var(--color-primary) 36%, transparent))
    drop-shadow(0 5px 10px rgb(15 23 42 / 18%));
}

.base-loader__spinner {
  position: absolute;
  inset: calc(var(--loader-ring) * -2.5);
  color: currentColor;
}

.base-loader__spinner :deep(svg) {
  width: 100%;
  height: 100%;
  animation-duration: 1.05s;
}

.base-loader__spinner :deep(circle) {
  stroke: currentColor;
}

.base-loader--inline .base-loader__mark::before {
  background:
    conic-gradient(from 0deg, transparent, currentColor, #47bfff, transparent 78%),
    color-mix(in srgb, currentColor 12%, transparent);
}

.base-loader--inline .base-loader__mark::after {
  background: color-mix(in srgb, currentColor 24%, transparent);
}

.base-loader--inline .base-loader__mark img {
  width: 80%;
  height: 80%;
}

.base-loader__copy {
  display: grid;
  gap: var(--space-1);
  max-width: 18rem;
}

.base-loader__copy strong {
  color: var(--color-text);
  font-size: 0.95rem;
}

.base-loader__copy small {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}

.base-loader--sm {
  --loader-size: 1rem;
  --loader-ring: 1.5px;
}

.base-loader--lg {
  --loader-size: 3rem;
  --loader-ring: 3px;
}

.base-loader--panel.base-loader--sm {
  --loader-size: 2.25rem;
}

.base-loader--panel.base-loader--md {
  --loader-size: 3rem;
}

.base-loader--panel.base-loader--lg {
  --loader-size: 4rem;
}

@keyframes loader-orbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader-breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-0.08rem) scale(1.04);
  }
}

@keyframes loader-glow {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.92);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .base-loader__mark,
  .base-loader__mark::before,
  .base-loader__mark::after {
    animation: none;
  }
}
</style>
