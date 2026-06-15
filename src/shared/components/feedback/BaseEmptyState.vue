<script setup lang="ts">
import Card from 'primevue/card'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <Card class="empty-state">
    <template #content>
      <div class="empty-state__content">
        <div class="empty-state__visual" aria-hidden="true">
          <span class="empty-state__mark">
            <img src="/favicon.svg" alt="" />
          </span>
        </div>
        <strong>{{ title }}</strong>
        <p v-if="description">{{ description }}</p>
        <slot />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.empty-state {
  position: relative;
  overflow: hidden;
  width: min(100%, 32rem);
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 94%, transparent), color-mix(in srgb, var(--color-surface-muted) 68%, transparent)),
    radial-gradient(circle at 50% 0, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 58%);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 56%) inset,
    0 18px 46px rgb(15 23 42 / 9%);
}

.empty-state :deep(.p-card-body),
.empty-state :deep(.p-card-content) {
  padding: 0;
}

.empty-state__content {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: var(--space-2);
}

.empty-state::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 0 38%, rgb(255 255 255 / 18%) 48%, transparent 58%);
  content: '';
  opacity: 0.66;
  transform: translateX(-70%);
  animation: empty-state-shine 5.8s ease-in-out infinite;
}

:root.dark .empty-state {
  box-shadow:
    0 1px 0 rgb(255 255 255 / 8%) inset,
    0 18px 46px rgb(0 0 0 / 24%);
}

.empty-state__visual {
  position: relative;
  display: grid;
  width: 4.25rem;
  height: 4.25rem;
  place-items: center;
  margin-bottom: var(--space-1);
  isolation: isolate;
}

.empty-state__visual::before,
.empty-state__visual::after {
  position: absolute;
  pointer-events: none;
  content: '';
}

.empty-state__visual::before {
  inset: 0;
  z-index: -1;
  border: 1px solid color-mix(in srgb, var(--color-primary) 36%, transparent);
  border-radius: 1.35rem;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent),
    color-mix(in srgb, var(--color-surface) 78%, transparent);
  transform: rotate(8deg);
}

.empty-state__visual::after {
  inset: 18%;
  z-index: -2;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 34%, transparent);
  filter: blur(18px);
  opacity: 0.76;
}

.empty-state__mark {
  display: grid;
  width: 3.1rem;
  height: 3.1rem;
  place-items: center;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 46%) inset,
    0 14px 28px rgb(15 23 42 / 12%);
}

.empty-state__mark img {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--color-primary) 38%, transparent));
}

.empty-state strong,
.empty-state p,
.empty-state :deep(.base-button) {
  position: relative;
  z-index: 1;
}

.empty-state strong {
  color: var(--color-text);
  font-size: 1rem;
}

.empty-state p {
  max-width: 24rem;
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

@keyframes empty-state-shine {
  0%,
  46% {
    transform: translateX(-70%);
  }

  78%,
  100% {
    transform: translateX(70%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .empty-state::before {
    animation: none;
  }
}
</style>
