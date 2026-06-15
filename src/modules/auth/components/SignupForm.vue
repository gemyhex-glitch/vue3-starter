<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import AuthPhoneInput from '@modules/auth/components/AuthPhoneInput.vue'
import BaseCheckbox from '@shared/components/form/BaseCheckbox.vue'
import BasePasswordInput from '@shared/components/form/BasePasswordInput.vue'
import BaseModal from '@shared/components/feedback/BaseModal.vue'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import { defaultPhoneCountry, isValidE164Phone } from '@shared/utils/phone'
import type { SignupPayload } from '@modules/auth/model/types'

type SignupField = 'phone' | 'password' | 'password_confirmation' | 'accepted_terms'
type LegalModal = 'terms' | 'privacy'

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  submit: [payload: SignupPayload]
  signIn: []
}>()
const { t } = useI18n()

const passwordRequirements = computed(() => [
  {
    label: t('auth.passwordRequirements.min'),
    test: (value: string) => value.length >= 8,
  },
  {
    label: t('auth.passwordRequirements.uppercase'),
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: t('auth.passwordRequirements.number'),
    test: (value: string) => /\d/.test(value),
  },
  {
    label: t('auth.passwordRequirements.special'),
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
])

const schema = z
  .object({
    country_id: z.number(),
    phone: z
      .string()
      .refine(isValidE164Phone, t('auth.validation.validPhone')),
    password: z
      .string()
      .min(8, t('auth.validation.passwordMin'))
      .regex(/[A-Z]/, t('auth.validation.passwordUppercase'))
      .regex(/\d/, t('auth.validation.passwordNumber'))
      .regex(/[^A-Za-z0-9]/, t('auth.validation.passwordSpecial')),
    password_confirmation: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
    accepted_terms: z.boolean().refine((value) => value, t('auth.validation.acceptTerms')),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ['password_confirmation'],
    message: t('auth.validation.passwordsMatch'),
  })

const { values, errors, submitCount, setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    country_id: defaultPhoneCountry.id,
    phone: '',
    password: '',
    password_confirmation: '',
    accepted_terms: false,
  },
  validateOnMount: false,
})

const activeLegalModal = ref<LegalModal | null>(null)
const passwordValue = computed(() => String(values.password ?? ''))

const onSubmit = handleSubmit((submittedValues) => {
  emit('submit', {
    country_id: submittedValues.country_id,
    phone: submittedValues.phone,
    password: submittedValues.password,
    password_confirmation: submittedValues.password_confirmation,
    type: 'regular',
  })
})

function getError(name: SignupField): string | undefined {
  if (submitCount.value === 0) {
    return undefined
  }

  const error = errors.value[name]
  return Array.isArray(error) ? error[0] : error
}

function setCountryId(countryId: number): void {
  setFieldValue('country_id', countryId, false)
}

function setAcceptedTerms(value: boolean): void {
  setFieldValue('accepted_terms', value, false)
}
</script>

<template>
  <form class="signup-form form-stack" autocomplete="off" novalidate @submit="onSubmit">
    <AuthPhoneInput
      id="signup-phone"
      :model-value="String(values.phone ?? '')"
      :label="t('auth.fields.phoneNumber')"
      :placeholder="defaultPhoneCountry.example"
      :error="getError('phone')"
      :disabled="props.loading"
      required
      @update:model-value="setFieldValue('phone', $event, false)"
      @country-id-change="setCountryId"
    />

    <BasePasswordInput
      id="signup-password"
      :model-value="String(values.password ?? '')"
      :label="t('auth.fields.password')"
      :placeholder="t('auth.placeholders.password')"
      autocomplete="new-password"
      :error="getError('password')"
      :disabled="props.loading"
      required
      @update:model-value="setFieldValue('password', $event, false)"
    />

    <BasePasswordInput
      id="signup-password-confirmation"
      :model-value="String(values.password_confirmation ?? '')"
      :label="t('auth.fields.confirmPassword')"
      :placeholder="t('auth.placeholders.password')"
      autocomplete="new-password"
      :error="getError('password_confirmation')"
      :disabled="props.loading"
      required
      @update:model-value="setFieldValue('password_confirmation', $event, false)"
    />

    <section class="password-checker" :aria-label="t('auth.signup.passwordRequirementsLabel')">
      <strong>{{ t('auth.signup.passwordRequirementsTitle') }}</strong>
      <ul>
        <li
          v-for="requirement in passwordRequirements"
          :key="requirement.label"
          :class="{ 'password-checker__item--met': requirement.test(passwordValue) }"
        >
          {{ requirement.label }}
        </li>
      </ul>
    </section>

    <BaseCheckbox
      id="signup-accepted-terms"
      :model-value="Boolean(values.accepted_terms)"
      :error="getError('accepted_terms')"
      :disabled="props.loading"
      @update:model-value="setAcceptedTerms"
    >
      <span class="signup-consent">
        {{ t('auth.signup.acceptedTermsPrefix') }}
        <button type="button" @click.stop="activeLegalModal = 'terms'">{{ t('auth.signup.terms') }}</button>
        {{ t('auth.signup.acceptedTermsMiddle') }}
        <button type="button" @click.stop="activeLegalModal = 'privacy'">{{ t('auth.signup.privacy') }}</button>
      </span>
    </BaseCheckbox>

    <BaseButton type="submit" size="lg" :loading="props.loading" :disabled="props.loading">
      {{ props.loading ? t('auth.signup.loading') : t('auth.signup.submit') }}
    </BaseButton>

    <p class="signup-form__switch">
      {{ t('auth.signup.alreadyHaveAccount') }}
      <button type="button" @click="emit('signIn')">{{ t('auth.signup.signIn') }}</button>
    </p>
  </form>

  <BaseModal
    :open="activeLegalModal === 'terms'"
    :title="t('auth.signup.terms')"
    @close="activeLegalModal = null"
  />
  <BaseModal
    :open="activeLegalModal === 'privacy'"
    :title="t('auth.signup.privacy')"
    @close="activeLegalModal = null"
  />
</template>

<style scoped>
.password-checker {
  display: grid;
  gap: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface-muted) 76%, transparent);
  padding: 1rem;
}

.password-checker strong {
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 800;
}

.password-checker ul {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.password-checker li {
  display: flex;
  align-items: center;
  gap: 0.48rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.password-checker li::before {
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.password-checker__item--met {
  color: #059669;
}

.signup-consent {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

.signup-consent button,
.signup-form__switch button {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  padding: 0;
}

.signup-consent button:hover,
.signup-form__switch button:hover {
  text-decoration: underline;
}

.signup-form__switch {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  text-align: center;
}
</style>
