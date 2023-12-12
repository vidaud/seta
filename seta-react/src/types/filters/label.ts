export type Label = {
  id: string
  name: string
  color: string
  category: string
}

export type GroupedLabels = Record<string, Label[]>
