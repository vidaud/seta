import { ExportMimeType } from '~/types/library/library-export'
import type { ExportSelectItem } from '~/types/library/library-export'

export const EXPORT_FORMATS: ExportSelectItem[] = [
  {
    value: 'csv',
    label: ExportMimeType.csv.name
  },
  {
    value: 'json',
    label: ExportMimeType.json.name
  }
]
