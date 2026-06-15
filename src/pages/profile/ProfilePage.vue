<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseAvatar from '@shared/components/ui/BaseAvatar.vue'
import BaseCard from '@shared/components/ui/BaseCard.vue'
import BaseLoader from '@shared/components/feedback/BaseLoader.vue'
import { useAuth } from '@modules/auth/composables/useAuth'
import {
  getUserAvatarUrl,
  getUserContactLabel,
  getUserDisplayName,
  getUserEmail,
  getUserPhone,
} from '@models/user/model'

const { t } = useI18n()
const { user, isProfileLoading, fetchProfile } = useAuth()

const userName = computed(() => getUserDisplayName(user.value, t('layout.userFallbackName')))
const userEmail = computed(() => getUserEmail(user.value))
const userContact = computed(() => getUserContactLabel(user.value))
const userAvatar = computed(() => getUserAvatarUrl(user.value))
const userPhone = computed(() => getUserPhone(user.value))

const profileDetails = computed(() =>
  [
    { label: t('profile.fields.name'), value: userName.value },
    { label: t('profile.fields.email'), value: userEmail.value },
    { label: t('profile.fields.phone'), value: userPhone.value },
    {
      label: t('profile.fields.role'),
      value: user.value?.role ? t(`users.roles.${user.value.role}`) : '',
    },
    {
      label: t('profile.fields.status'),
      value: user.value?.status ? t(`users.statuses.${user.value.status}`) : '',
    },
  ].filter((item) => item.value),
)

onMounted(() => {
  void fetchProfile()
})
</script>

<template>
  <section class="page-stack profile-page">
    <header class="page-heading">
      <div>
        <p class="eyebrow">{{ t('profile.eyebrow') }}</p>
        <h1>{{ t('profile.title') }}</h1>
        <p>{{ t('profile.subtitle') }}</p>
      </div>
    </header>

    <BaseLoader
      v-if="isProfileLoading && !user"
      variant="panel"
      :label="t('profile.loading')"
    />

    <BaseCard v-else class="profile-card">
      <div class="profile-card__header">
        <BaseAvatar :name="userName" :src="userAvatar" />
        <div>
          <h2>{{ userName }}</h2>
          <p v-if="userContact">{{ userContact }}</p>
        </div>
      </div>

      <dl class="profile-card__details">
        <template v-for="item in profileDetails" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </template>
      </dl>
    </BaseCard>
  </section>
</template>

<style scoped>
.profile-card {
  max-width: 42rem;
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
}

.profile-card__header :deep(.avatar) {
  width: 4rem;
  height: 4rem;
  font-size: 1.2rem;
}

.profile-card__header h2,
.profile-card__header p {
  margin: 0;
}

.profile-card__header h2 {
  color: var(--color-text);
  font-size: 1.25rem;
}

.profile-card__header p {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
}

.profile-card__details {
  display: grid;
  grid-template-columns: minmax(8rem, 0.35fr) minmax(0, 1fr);
  gap: var(--space-3) var(--space-4);
  margin: var(--space-5) 0 0;
}

.profile-card__details dt {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 800;
}

.profile-card__details dd {
  min-width: 0;
  margin: 0;
  color: var(--color-text);
  font-weight: 850;
  overflow-wrap: anywhere;
}

@media (max-width: 560px) {
  .profile-card__header {
    align-items: flex-start;
  }

  .profile-card__details {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }

  .profile-card__details dd {
    margin-bottom: var(--space-3);
  }
}
</style>
