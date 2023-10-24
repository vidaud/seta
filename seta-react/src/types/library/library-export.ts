export type LibraryItemExport = {
  documentId: string
  // TODO: Export `path` as well
  paths: string[]
}

export type ExportField = {
  name: string
  description: string
}

export type LibraryExport = {
  // The optional value to include in the name of the exported file
  reference?: string
  exportItems: LibraryItemExport[]
}

export type ExportFormatKey = 'csv' | 'json'

export const ExportMimeType: Record<
  ExportFormatKey,
  {
    name: string
    mimeType: string
  }
> = {
  csv: {
    name: 'CSV',
    mimeType: 'text/csv'
  },
  json: {
    name: 'JSON',
    mimeType: 'application/json'
  }
} as const

export type ExportSelectItem = {
  value: ExportFormatKey
  label: string
}

export type ExportStorage = {
  fieldsNames: string[]
  format: ExportFormatKey
}
