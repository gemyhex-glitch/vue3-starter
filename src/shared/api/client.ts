import axios from 'axios'
import { env } from '@shared/config/env'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(env.apiKey ? { 'api-key': env.apiKey } : {}),
  },
  timeout: 20_000,
})
