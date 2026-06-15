<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import AuthPhoneInput from '@modules/auth/components/AuthPhoneInput.vue'
import BasePasswordInput from '@shared/components/form/BasePasswordInput.vue'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import { defaultPhoneCountry, isValidE164Phone } from '@shared/utils/phone'
import type { LoginPayload } from '@modules/auth/model/types'

type PhoneLoginField = 'phone' | 'password' | 'country_id'

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  submit: [payload: LoginPayload]
}>()
const { t } = useI18n()

const schema = z.object({
  country_id: z.number(),
  phone: z
    .string()
    .refine(isValidE164Phone, t('auth.validation.validPhone')),
  password: z.string().min(8, t('auth.validation.passwordMin')),
})

const { values, errors, submitCount, setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    country_id: defaultPhoneCountry.id,
    phone: '',
    password: '',
  },
  validateOnMount: false,
})

const onSubmit = handleSubmit((submittedValues) => {
  emit('submit', {
    country_id: submittedValues.country_id,
    phone: submittedValues.phone,
    password: submittedValues.password,
    type: 'regular',
  })
})

function getError(name: PhoneLoginField): string | undefined {
  if (submitCount.value === 0) {
    return undefined
  }

  const error = errors.value[name]
  return Array.isArray(error) ? error[0] : error
}

function setCountryId(countryId: number): void {
  setFieldValue('country_id', countryId, false)
}
</script>

<template>
  <form class="form-stack" autocomplete="off" novalidate @submit="onSubmit">
    <AuthPhoneInput
      id="phone"
      :model-value="values.phone"
      :label="t('auth.fields.phone')"
      :placeholder="defaultPhoneCountry.example"
      :error="getError('phone')"
      autocomplete="off"
      :disabled="props.loading"
      required
      @update:model-value="setFieldValue('phone', $event, false)"
      @country-id-change="setCountryId"
    />

    <BasePasswordInput
      id="password"
      :model-value="values.password"
      :label="t('auth.fields.password')"
      :placeholder="t('auth.placeholders.password')"
      :error="getError('password')"
      autocomplete="new-password"
      :disabled="props.loading"
      required
      @update:model-value="setFieldValue('password', $event, false)"
    />

    <BaseButton type="submit" size="lg" :loading="props.loading" :disabled="props.loading">
      {{ props.loading ? t('auth.actions.signingIn') : t('auth.actions.signIn') }}
    </BaseButton>
  </form>
</template>
