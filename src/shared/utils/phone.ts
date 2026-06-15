import { parsePhoneNumberFromString } from 'libphonenumber-js'

export interface PhoneCountry {
  id: number
  name: string
  code: string
  dialCode: string
  nationalMin: number
  nationalMax: number
  example: string
  flag?: string
}

export const fallbackPhoneCountries: PhoneCountry[] = [
  {
    id: 1,
    name: 'Saudi Arabia',
    flag: '/storage/Countries/saudia_arabia.jpg',
    code: '+966',
    dialCode: '966',
    nationalMin: 9,
    nationalMax: 9,
    example: '5********',
  },
]

export const defaultPhoneCountry = fallbackPhoneCountries[0] as PhoneCountry

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeE164Phone(value: string): string {
  const digits = phoneDigits(value)
  return digits ? `+${digits}` : ''
}

export function parseE164Phone(value: string) {
  const normalized = normalizeE164Phone(value)
  return normalized ? parsePhoneNumberFromString(normalized) : undefined
}

export function findPhoneCountry(
  value: string,
  countries: PhoneCountry[] = fallbackPhoneCountries,
): PhoneCountry | undefined {
  const digits = phoneDigits(value)

  return [...countries]
    .sort((first, second) => second.dialCode.length - first.dialCode.length)
    .find((country) => digits.startsWith(country.dialCode))
}

export function normalizeNationalPhone(country: PhoneCountry, value: string): string {
  const digits = phoneDigits(value)
  const hasTrunkPrefix = digits.startsWith('0') && digits.length > country.nationalMax

  return hasTrunkPrefix ? digits.slice(1) : digits
}

export function formatE164Phone(country: PhoneCountry, nationalNumber: string): string {
  const localDigits = normalizeNationalPhone(country, nationalNumber)
  const value = localDigits ? `+${country.dialCode}${localDigits}` : ''
  const phoneNumber = parseE164Phone(value)

  return phoneNumber?.number ? String(phoneNumber.number) : value
}

export function formatDisplayPhone(
  value: string,
  countries: PhoneCountry[] = fallbackPhoneCountries,
): string {
  const digits = phoneDigits(value)

  if (!digits) {
    return ''
  }

  const country = findPhoneCountry(value, countries)
  const countryCode = country?.dialCode ?? digits.slice(0, Math.max(1, digits.length - 9))
  const nationalNumber = digits.slice(countryCode.length)
  const groupedNationalNumber = nationalNumber.match(/.{1,3}/g)?.join(' ') ?? ''

  return groupedNationalNumber ? `+${countryCode} ${groupedNationalNumber}` : `+${countryCode}`
}

export function isValidE164Phone(value: string): boolean {
  const phoneNumber = parseE164Phone(value)

  return Boolean(phoneNumber?.isValid())
}
