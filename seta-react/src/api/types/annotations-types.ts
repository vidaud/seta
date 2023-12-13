export type AnnotationResponse = {
  id: string
  label: string
  color_code: string
  category_id?: string
  category?: {
    category_id?: string
    category_name?: string
  }
}
