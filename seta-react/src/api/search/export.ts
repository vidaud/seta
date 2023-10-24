import type { QueryKey } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '~/api'
import {
  ExportMimeType,
  type ExportField,
  type ExportFormatKey
} from '~/types/library/library-export'
import { getTimestamp } from '~/utils/date-utils'
import { downloadFile } from '~/utils/file-utils'
import { toKebabCase } from '~/utils/string-utils'

const FIELDS_CATALOG_API_PATH = '/export/catalog'
const EXPORT_API_PATH = '/export'

const EXPORT_FILE_NAME_PREFIX = 'seta-export'

export type FieldsCatalogResponse = {
  fields_catalog: ExportField[]
}

type UseFieldsCatalogArgs = {
  enabled?: boolean
  onSuccess?: (data: FieldsCatalogResponse) => void
}

export type ExportMetaPayload = {
  ids: string[]
  fields: string[]
  format: ExportFormatKey
}

export const fieldsCatalogQueryKey: QueryKey = ['fields-catalog']

/* GET FIELDS CATALOG */

const getFieldsCatalog = async (config?: AxiosRequestConfig): Promise<FieldsCatalogResponse> => {
  const { data } = await api.get<FieldsCatalogResponse>(FIELDS_CATALOG_API_PATH, config)

  return data
}

export const useFieldsCatalog = (args?: UseFieldsCatalogArgs) => {
  const { enabled = true, ...rest } = args ?? {}

  return useQuery({
    queryKey: fieldsCatalogQueryKey,
    queryFn: getFieldsCatalog,
    enabled,
    ...rest
  })
}

/* EXPORT METADATA */

export const exportMeta = async (
  { ids, fields, format }: ExportMetaPayload,
  reference?: string,
  config?: AxiosRequestConfig
) => {
  const mimeType = ExportMimeType[format].mimeType

  const { data } = await api.post<Blob>(
    EXPORT_API_PATH,
    { ids, fields },
    {
      ...config,
      responseType: 'blob',
      headers: {
        Accept: mimeType
      }
    }
  )

  // Generate file name based on timestamp, optional reference, and format
  const timestamp = getTimestamp()
  const referenceHint = reference ? `-${toKebabCase(reference)}` : ''

  const fileName = `${EXPORT_FILE_NAME_PREFIX}${referenceHint}-${timestamp}.${format}`

  downloadFile(data, fileName)
}
