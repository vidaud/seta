import { MIME_TYPES } from '@mantine/dropzone'

export const ACCEPTED_MIME_TYPES: string[] = [
  MIME_TYPES.pdf,
  MIME_TYPES.doc,
  MIME_TYPES.docx,
  MIME_TYPES.ppt,
  MIME_TYPES.pptx,
  MIME_TYPES.xls,
  MIME_TYPES.xlsx,
  'text/plain'
]

export const MAX_FILES = 10
export const MAX_FILE_SIZE = 5 * 1024 ** 2 // 5 MB
