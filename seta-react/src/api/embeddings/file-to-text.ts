import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import api from '../api'
import type { FileToTextResponse } from '../types/file-to-text.-types'

const FILE_TO_TEXT_API_PATH = '/file_to_text'

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

  return {
    text: data.text
  }
}

export const useFileToText = (file?: FormData) =>
  useQuery({ queryKey: queryKey.file(file), queryFn: () => getFileToText(file) })

const retrieveText = async (file: File, config?: AxiosRequestConfig) => {
  const formData = new FormData()

  formData.append('file', file)

  const { data } = await api.post<FileToTextResponse>(`${FILE_TO_TEXT_API_PATH}`, formData, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  })

  return data.text
}

export const getTextFromFile = async (file?: File, config?: AxiosRequestConfig) => {
  if (!file) {
    return { text: '' }
  }

  const text = await retrieveText(file, config)

  return {
    text
  }
}

export const getTextFromFiles = async (files?: File[], config?: AxiosRequestConfig) => {
  if (!files) {
    return { text: '' }
  }

  const textValues: string[] = []

  for (const file of files) {
    const text = await retrieveText(file, config)

    textValues.push(
      text
        .split('\n')
        .filter(Boolean)
        .map(value => `"${value}"`)
        .join(' ')
    )
  }

  return {
    text: textValues.join(' ')
  }
}
