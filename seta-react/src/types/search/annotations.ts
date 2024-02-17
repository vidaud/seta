export type Label = {
  id: string
  name: string
  color: string
  category: string
}

export type GroupedLabels = Record<string, Label[]>

export type Annotation = {
  id: string
  start: number
  end: number
}

export type AnnotationInfo = Label & Annotation
