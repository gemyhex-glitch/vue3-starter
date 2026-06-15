<script setup lang="ts">
import { z } from 'zod'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DynamicForm from '@shared/components/form/DynamicForm.vue'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import type { LoginPayload } from '@modules/auth/model/types'
import type { DynamicFormField, FormValues } from '@shared/types/form'

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
  email: z.string().email(),
  password: z.string().min(8, t('auth.validation.passwordMin')),
})

const fields = computed<DynamicFormField[]>(() => [
  {
    type: 'email',
    name: 'email',
    label: t('auth.fields.email'),
    component: 'BaseInput',
    placeholder: t('auth.placeholders.email'),
  },
  {
    type: 'password',
    name: 'password',
    label: t('auth.fields.password'),
    component: 'BasePasswordInput',
    placeholder: t('auth.placeholders.password'),
  },
])

const defaultValues = {
  email: '',
  password: '',
}

function submit(values: FormValues): void {
  emit('submit', {
    email: String(values.email),
    password: String(values.password),
  })
}
</script>

<template>
  <DynamicForm
    :fields="fields"
    :validation-schema="schema"
    :default-values="defaultValues"
    :loading="props.loading"
    :submit-label="t('auth.actions.signIn')"
    @submit="submit"
  >
    <template #actions>
      <BaseButton type="submit" size="lg" :loading="props.loading" :disabled="props.loading">
        {{ props.loading ? t('auth.actions.signingIn') : t('auth.actions.signIn') }}
      </BaseButton>
    </template>
  </DynamicForm>
</template>
