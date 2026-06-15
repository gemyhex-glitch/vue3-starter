<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BasePhoneInput from '@shared/components/form/BasePhoneInput.vue'
import { countryService } from '@shared/api/country.service'
import { fallbackPhoneCountries } from '@shared/utils/phone'
import type { PhoneCountry } from '@shared/utils/phone'

const model = defineModel<string>({ default: '' })
const props = defineProps<{
  id?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  'country-id-change': [countryId: number]
}>()

const countries = ref<PhoneCountry[]>(fallbackPhoneCountries)
const isLoadingCountries = ref(false)

onMounted(async () => {
  isLoadingCountries.value = true

  try {
    countries.value = await countryService.listPhoneCountries()
  } catch {
    countries.value = fallbackPhoneCountries
  } finally {
    isLoadingCountries.value = false
  }
})
</script>

<template>
  <BasePhoneInput
    v-model="model"
    :id="props.id"
    :label="props.label"
    :placeholder="props.placeholder"
    :hint="props.hint"
    :error="props.error"
    :autocomplete="props.autocomplete"
    :disabled="props.disabled || isLoadingCountries"
    :required="props.required"
    :countries="countries"
    @country-id-change="emit('country-id-change', $event)"
  />
</template>
