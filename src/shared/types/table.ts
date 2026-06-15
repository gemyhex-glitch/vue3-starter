import type { SelectOption } from '@shared/types/form'

export type TableRow = Record<string, unknown>

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
}

export interface TableFilter {
  key: string
  label: string
  type: 'text' | 'select'
  options?: SelectOption[]
}
