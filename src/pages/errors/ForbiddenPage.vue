<script setup lang="ts">
import { ArrowLeftIcon, HomeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BaseButton from '@shared/components/ui/BaseButton.vue'

const router = useRouter()
const { t } = useI18n()

function goBack(): void {
  if (globalThis.history.length > 1) {
    router.back()
    return
  }

  void router.replace({ name: 'dashboard' })
}
</script>

<template>
  <section class="forbidden-page" aria-labelledby="forbidden-title">
    <div class="forbidden-page__halo" aria-hidden="true"></div>

    <div class="forbidden-page__content">
      <span class="forbidden-page__status">403</span>

      <span class="forbidden-page__icon" aria-hidden="true">
        <LockClosedIcon />
      </span>

      <header class="forbidden-page__header">
        <h1 id="forbidden-title">{{ t('forbidden.title') }}</h1>
        <p>
          {{ t('forbidden.description') }}
        </p>
      </header>

      <div class="forbidden-page__actions">
        <BaseButton size="lg" @click="router.replace({ name: 'dashboard' })">
          <template #icon>
            <HomeIcon aria-hidden="true" />
          </template>
          {{ t('forbidden.dashboard') }}
        </BaseButton>

        <BaseButton variant="secondary" size="lg" @click="goBack">
          <template #icon>
            <ArrowLeftIcon aria-hidden="true" />
          </template>
          {{ t('forbidden.back') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.forbidden-page {
  position: relative;
  width: min(100%, 31rem);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 1.1rem;
  background:
    linear-gradient(150deg, rgb(255 255 255 / 74%), rgb(255 255 255 / 40%)),
    color-mix(in srgb, var(--color-surface) 84%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 78%) inset,
    0 24px 80px rgb(15 23 42 / 18%),
    0 4px 18px rgb(15 23 42 / 8%);
  backdrop-filter: blur(24px) saturate(140%);
}

.forbidden-page__halo {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, rgb(255 255 255 / 42%), transparent 35%),
    radial-gradient(circle at 50% 0, color-mix(in srgb, var(--color-danger) 14%, transparent), transparent 52%),
    linear-gradient(245deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 44%);
  pointer-events: none;
}

.forbidden-page__content {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: var(--space-5);
  padding: var(--space-8);
  text-align: center;
}

.forbidden-page__status {
  display: inline-flex;
  min-height: 1.8rem;
  align-items: center;
  padding: 0 var(--space-3);
  border: 1px solid color-mix(in srgb, var(--color-danger) 26%, var(--color-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-danger) 8%, var(--color-surface));
  color: var(--color-danger);
  font-size: 0.75rem;
  font-weight: 900;
}

.forbidden-page__icon {
  display: grid;
  width: 4rem;
  height: 4rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-primary) 24%, var(--color-border));
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 62%), transparent),
    color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
  color: var(--color-primary);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 70%) inset,
    0 16px 34px color-mix(in srgb, var(--color-primary) 16%, transparent);
}

.forbidden-page__icon svg {
  width: 1.8rem;
  height: 1.8rem;
}

.forbidden-page__header {
  display: grid;
  gap: var(--space-3);
}

.forbidden-page h1 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(2rem, 8vw, 2.65rem);
  line-height: 1.05;
}

.forbidden-page p {
  max-width: 24rem;
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.forbidden-page__actions {
  display: grid;
  width: min(100%, 18rem);
  gap: var(--space-3);
}

:root.dark .forbidden-page {
  background:
    linear-gradient(150deg, rgb(17 24 39 / 78%), rgb(17 24 39 / 44%)),
    color-mix(in srgb, var(--color-surface) 78%, transparent);
}

[dir='rtl'] .forbidden-page__actions :deep(svg) {
  transform: rotate(180deg);
}

@media (max-width: 420px) {
  .forbidden-page__content {
    padding: var(--space-6);
  }
}
</style>
