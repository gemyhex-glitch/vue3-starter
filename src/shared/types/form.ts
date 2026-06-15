export interface SelectOption {
  label: string
  value: string | number
}

export type FormValues = Record<string, unknown>

export type DynamicFormComponent =
  | 'BaseInput'
  | 'BasePasswordInput'
  | 'BaseCheckbox'
  | 'BaseCheckboxGroup'
  | 'BaseRadioGroup'
  | 'BaseTextarea'
  | 'BaseSelect'

export interface DynamicFormField {
  type: string
  name: string
  label: string
  component: DynamicFormComponent
  placeholder?: string
  hint?: string
  options?: SelectOption[]
  visibleWhen?: (values: FormValues) => boolean
}
