<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import type { ZodTypeAny } from 'zod'
import BaseInput from '@shared/components/form/BaseInput.vue'
import BasePasswordInput from '@shared/components/form/BasePasswordInput.vue'
import BaseCheckbox from '@shared/components/form/BaseCheckbox.vue'
import BaseCheckboxGroup from '@shared/components/form/BaseCheckboxGroup.vue'
import BaseRadioGroup from '@shared/components/form/BaseRadioGroup.vue'
import BaseTextarea from '@shared/components/form/BaseTextarea.vue'
import BaseSelect from '@shared/components/form/BaseSelect.vue'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import type { DynamicFormField, FormValues } from '@shared/types/form'

const props = withDefaults(
  defineProps<{
    fields: DynamicFormField[]
    validationSchema: ZodTypeAny
    defaultValues?: FormValues
    submitLabel?: string
    loading?: boolean
  }>(),
  {
    defaultValues: () => ({}),
    submitLabel: '',
    loading: false,
  },
)

const emit = defineEmits<{
  submit: [values: FormValues]
}>()
const { t } = useI18n()

const componentMap = {
  BaseInput,
  BasePasswordInput,
  BaseCheckbox,
  BaseCheckboxGroup,
  BaseRadioGroup,
  BaseTextarea,
  BaseSelect,
} as const

const { values, errors, submitCount, setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(props.validationSchema),
  initialValues: props.defaultValues,
  validateOnMount: false,
})

const visibleFields = computed(() =>
  props.fields.filter((field) => field.visibleWhen?.(values) ?? true),
)
const resolvedSubmitLabel = computed(() => props.submitLabel || t('common.submit'))

const onSubmit = handleSubmit((submittedValues) => {
  emit('submit', submittedValues)
})

function getError(name: string): string | undefined {
  if (submitCount.value === 0) {
    return undefined
  }

  const error = errors.value[name]
  return Array.isArray(error) ? error[0] : error
}
</script>

<template>
  <form class="form-stack" autocomplete="off" novalidate @submit="onSubmit">
    <component
      :is="componentMap[field.component]"
      v-for="field in visibleFields"
      :id="field.name"
      :key="field.name"
      :model-value="values[field.name]"
      :type="field.type"
      :name="field.name"
      :label="field.label"
      :placeholder="field.placeholder"
      :hint="field.hint"
      :options="field.options ?? []"
      :error="getError(field.name)"
      @update:model-value="setFieldValue(field.name, $event, false)"
    />

    <slot name="actions">
      <BaseButton type="submit" :loading="loading">{{ resolvedSubmitLabel }}</BaseButton>
    </slot>
  </form>
</template>
