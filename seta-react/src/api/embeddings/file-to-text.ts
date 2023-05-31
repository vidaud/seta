import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '../api'

const FILE_TO_TEXT_API_PATH = '/file_to_text'

export type FileToTextResponse = {
  text: string
}

export const queryKey = {
  root: 'file_to_text',
  file: (file?: FormData) => [queryKey.root, file]
}

const getFileToText = async (
  file?: FormData,
  config?: AxiosRequestConfig
): Promise<FileToTextResponse> => {
  if (!file) {
    return { text: '' }
  }

  const { data } = await api.post<FileToTextResponse>(`${FILE_TO_TEXT_API_PATH}`, file, config)

  // Remove duplicates
  return {
    text: data.text
  }
}

export const useFileToText = (file?: FormData) =>
  useQuery({ queryKey: queryKey.file(file), queryFn: () => getFileToText(file) })
