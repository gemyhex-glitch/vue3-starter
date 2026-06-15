<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import {
  defaultPhoneCountry,
  findPhoneCountry,
  formatE164Phone,
  normalizeNationalPhone,
  phoneDigits,
  type PhoneCountry,
} from '@shared/utils/phone'

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{
  'country-id-change': [countryId: number]
}>()

const props = defineProps<{
  id?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
  required?: boolean
  countries?: PhoneCountry[]
}>()

const fallbackCountries = [defaultPhoneCountry]
const selectedCountry = ref<PhoneCountry>(defaultPhoneCountry)
const nationalNumber = ref('')
const failedFlagUrls = ref<Set<string>>(new Set())
const { t } = useI18n()
let isSyncingFromModel = false

const supportId = computed(() => (props.id ? `${props.id}-support` : undefined))
const availableCountries = computed(() =>
  props.countries?.length ? props.countries : fallbackCountries,
)
const maxNationalLength = computed(() => selectedCountry.value.nationalMax)
const isInvalid = computed(() => Boolean(props.error))
function getCountryInitials(countryName: string): string {
  return countryName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function getCountryShortName(countryName: string): string {
  return getCountryInitials(countryName)
}

function shouldShowFlag(country: PhoneCountry): boolean {
  return Boolean(country.flag && !failedFlagUrls.value.has(country.flag))
}

function markFlagFailed(flag: string | undefined): void {
  if (!flag) {
    return
  }

  failedFlagUrls.value = new Set([...failedFlagUrls.value, flag])
}

const phoneInputValue = computed({
  get: () => nationalNumber.value,
  set: (value: string) => {
    nationalNumber.value = getNormalizedNationalNumber(value)
  },
})

function getNormalizedNationalNumber(value: string): string {
  const digits = phoneDigits(value)
  const nationalDigits =
    digits.startsWith(selectedCountry.value.dialCode) && digits.length > maxNationalLength.value
      ? digits.slice(selectedCountry.value.dialCode.length)
      : digits

  return normalizeNationalPhone(selectedCountry.value, nationalDigits).slice(
    0,
    maxNationalLength.value,
  )
}

function syncFromModel(value: string): void {
  isSyncingFromModel = true

  const country = findPhoneCountry(value, availableCountries.value)

  if (country) {
    selectedCountry.value = country
    nationalNumber.value = phoneDigits(value)
      .slice(country.dialCode.length)
      .slice(0, maxNationalLength.value)
  } else if (!value) {
    nationalNumber.value = ''
  }

  isSyncingFromModel = false
}

watch(() => model.value, syncFromModel, { immediate: true })

watch(
  availableCountries,
  (countries) => {
    const countryFromModel = findPhoneCountry(model.value, countries)
    selectedCountry.value = countryFromModel ?? countries[0] ?? defaultPhoneCountry
    syncFromModel(model.value)
  },
  { immediate: true },
)

watch(
  selectedCountry,
  (country) => {
    emit('country-id-change', country.id)
  },
  { immediate: true },
)

watch([selectedCountry, nationalNumber], () => {
  if (isSyncingFromModel) {
    return
  }

  model.value = formatE164Phone(selectedCountry.value, nationalNumber.value)
})
</script>

<template>
  <label class="field" :for="id">
    <span v-if="label" class="field__label">{{ label }}</span>
    <span class="phone-control" :class="{ 'phone-control--invalid': isInvalid }">
      <Select
        v-model="selectedCountry"
        class="phone-control__country"
        :options="availableCountries"
        option-label="name"
        data-key="id"
        :disabled="disabled"
        :invalid="isInvalid"
        :aria-label="t('phone.countryCode')"
        append-to="body"
      >
        <template #value="{ value }">
          <span class="phone-control__country-value">
            <span class="phone-control__flag phone-control__flag--selected" aria-hidden="true">
              <img
                v-if="shouldShowFlag(value)"
                :src="value.flag"
                alt=""
                @error="markFlagFailed(value.flag)"
              />
              <span v-else>{{ getCountryInitials(value.name) }}</span>
            </span>
            <span class="phone-control__code">{{ value.code }}</span>
          </span>
        </template>
        <template #option="{ option }">
          <span class="phone-control__country-option">
            <span class="phone-control__country-identity">
              <span class="phone-control__flag" aria-hidden="true">
                <img
                  v-if="shouldShowFlag(option)"
                  :src="option.flag"
                  alt=""
                  @error="markFlagFailed(option.flag)"
                />
                <span v-else>{{ getCountryInitials(option.name) }}</span>
              </span>
              <span
                v-if="shouldShowFlag(option)"
                class="phone-control__country-initials"
                aria-hidden="true"
              >
                {{ getCountryShortName(option.name) }}
              </span>
              <strong>{{ option.name }}</strong>
            </span>
            <small>{{ option.code }}</small>
          </span>
        </template>
      </Select>

      <InputText
        :id="id"
        v-model="phoneInputValue"
        unstyled
        class="control phone-control__input"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        :autocomplete="props.autocomplete ?? 'off'"
        :maxlength="maxNationalLength"
        :placeholder="placeholder ?? selectedCountry.example"
        :disabled="disabled"
        :required="required"
        :invalid="isInvalid"
        :aria-invalid="isInvalid"
        :aria-describedby="supportId"
      />
    </span>

    <p v-if="error" :id="supportId" class="field__error">{{ error }}</p>
    <p v-else-if="hint" :id="supportId" class="field__hint">{{ hint }}</p>
  </label>
</template>

<style scoped>
.phone-control {
  display: grid;
  grid-template-columns: minmax(6.7rem, 0.28fr) minmax(0, 1fr);
  align-items: stretch;
  border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
  border-radius: var(--radius-md);
  background:
    linear-gradient(180deg, rgb(255 255 255 / 62%), transparent),
    color-mix(in srgb, var(--color-surface) 94%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 72%) inset,
    0 10px 26px rgb(15 23 42 / 6%);
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.phone-control:hover {
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  transform: translateY(-1px);
}

.phone-control:focus-within {
  border-color: color-mix(in srgb, var(--color-primary) 58%, var(--color-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-primary) 18%, transparent),
    0 0 18px color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.phone-control--invalid {
  border-color: var(--color-danger);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--color-danger) 16%, transparent),
    0 0 16px color-mix(in srgb, var(--color-danger) 8%, transparent);
}

.phone-control__country {
  min-width: 0;
  border: 0;
  border-inline-end: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  background: color-mix(in srgb, var(--color-surface-muted) 52%, transparent);
  box-shadow: none;
}

.phone-control__country :deep(.p-select-label) {
  padding: 0.48rem 0.52rem;
}

.phone-control__country :deep(.p-select-dropdown) {
  width: 1.45rem;
  color: var(--color-text-muted);
}

.phone-control__country-value {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--color-text);
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.phone-control__code {
  line-height: 1;
}

.phone-control__flag {
  display: inline-grid;
  width: 1.55rem;
  height: 1.55rem;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 0.62rem;
  font-weight: 900;
  box-shadow: 0 5px 14px rgb(15 23 42 / 10%);
}

.phone-control__flag--selected {
  width: 1.32rem;
  height: 1.32rem;
  font-size: 0.52rem;
}

.phone-control__flag img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.phone-control__country-option {
  display: flex;
  min-width: 13rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.32rem 0.12rem;
  color: var(--color-text);
}

.phone-control__country-identity {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.phone-control__country-initials {
  display: inline-flex;
  min-width: 1.9rem;
  min-height: 1.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface));
  color: color-mix(in srgb, var(--color-primary) 72%, var(--color-text));
  font-size: 0.68rem;
  font-weight: 900;
}

.phone-control__country-option strong {
  min-width: 0;
  overflow: hidden;
  font-size: 0.86rem;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.phone-control__country-option small {
  flex: 0 0 auto;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 900;
}

.phone-control__input {
  min-height: calc(var(--control-height) - 2px);
  border: 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background: transparent;
  box-shadow: none;
}

.phone-control__input:focus,
.phone-control__input:focus-visible {
  box-shadow: none;
}

[dir='rtl'] .phone-control__country {
  border-inline-end: 0;
  border-inline-start: 1px solid color-mix(in srgb, var(--color-border) 76%, transparent);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

[dir='rtl'] .phone-control__input {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

@media (max-width: 480px) {
  .phone-control {
    grid-template-columns: minmax(6.45rem, 0.28fr) minmax(0, 1fr);
  }

  .phone-control__country {
    border-inline-end: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
    border-bottom: 0;
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }

  .phone-control__input {
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
  }
}
</style>
