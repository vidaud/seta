import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import api from '../api'

const FILE_TO_TEXT_API_PATH = '/file_to_text'

const axiosConfig: AxiosRequestConfig = {
  baseURL: environment.nlpApiRoot
}

const retrieveText = async (file: File, config?: AxiosRequestConfig) => {
  const formData = new FormData()

  formData.append('file', file)

  const { data } = await api.post<string>(FILE_TO_TEXT_API_PATH, formData, {
    ...axiosConfig,
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

export const getTextFromFile = async (file?: File, config?: AxiosRequestConfig) => {
  if (!file) {
    return ''
  }

  const text = await retrieveText(file, config)

  return text
}
