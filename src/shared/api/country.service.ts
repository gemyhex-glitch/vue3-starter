import { apiClient } from '@shared/api/client'
import { env } from '@shared/config/env'
import { fallbackPhoneCountries, phoneDigits } from '@shared/utils/phone'
import type { PhoneCountry } from '@shared/utils/phone'

interface CountryApiItem {
  id: number
  name: string
  flag?: string
  code: string
  phone_digit_number: number
  placeholder: string
}

interface CountriesResponse {
  success: boolean
  message: string
  data: CountryApiItem[]
}

let countriesRequest: Promise<PhoneCountry[]> | null = null

function resolveCountryFlag(flag: string | undefined): string | undefined {
  if (!flag) {
    return undefined
  }

  if (/^https?:\/\//.test(flag) || env.apiBaseUrl.startsWith('/')) {
    return flag
  }

  return new URL(flag, env.apiBaseUrl).toString()
}

function mapCountry(country: CountryApiItem): PhoneCountry {
  const dialCode = phoneDigits(country.code)

  return {
    id: country.id,
    name: country.name,
    flag: resolveCountryFlag(country.flag),
    code: country.code,
    dialCode,
    nationalMin: country.phone_digit_number,
    nationalMax: country.phone_digit_number,
    example: country.placeholder,
  }
}

export const countryService = {
  async listPhoneCountries(): Promise<PhoneCountry[]> {
    if (env.useMockApi) {
      return fallbackPhoneCountries
    }

    countriesRequest ??= apiClient
      .get<CountriesResponse>('/countries')
      .then((response) => response.data.data.map(mapCountry))
      .then((countries) => (countries.length ? countries : fallbackPhoneCountries))
      .finally(() => {
        countriesRequest = null
      })

    return countriesRequest
  },
}
