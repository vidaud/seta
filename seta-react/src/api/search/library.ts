import type { QueryKey } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type AxiosRequestConfig } from 'axios'

import api from '~/api'
import { environment } from '~/environments/environment'
import { LibraryItemType } from '~/types/library/library-item'
import type {
  LibraryItem,
  LibraryItemCreate,
  LibraryItemUpdate
} from '~/types/library/library-item'

const defaultConfig: AxiosRequestConfig = {
  baseURL: environment.baseUrl
}

const LIBRARY_API_PATH = '/me/library'

export type LibraryResponse = {
  items: LibraryItem[]
}

export type ItemsResponse = LibraryItem[]

export type SaveDocumentsPayload = {
  parentId: string | null
  documents: {
    documentId: string
    title: string
    link?: string | null
  }[]
}

export const libraryQueryKey: QueryKey = ['library']

/* GET ALL ITEMS */

const getLibraryItems = async (config?: AxiosRequestConfig): Promise<LibraryResponse> => {
  const { data } = await api.get<LibraryResponse>(LIBRARY_API_PATH, {
    ...defaultConfig,
    ...config
  })

  return data
}

export const useLibrary = () => {
  return useQuery({
    queryKey: libraryQueryKey,
    queryFn: getLibraryItems
  })
}

/* SAVE DOCUMENTS */

const saveDocuments = async (
  { parentId, documents }: SaveDocumentsPayload,
  config?: AxiosRequestConfig
): Promise<void> => {
  const newDocuments: LibraryItemCreate[] = documents.map(({ documentId, title, link }) => ({
    type: LibraryItemType.Document,
    title,
    documentId,
    link,
    parentId
  }))

  await api.post<void, LibraryItemCreate[]>(LIBRARY_API_PATH, newDocuments, {
    ...defaultConfig,
    ...config
  })
}

export const useSaveDocuments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveDocuments,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryQueryKey })
    }
  })
}

/* CREATE NEW FOLDER */

const createNewFolder = async (
  { parentId, title }: Omit<LibraryItemCreate, 'type'>,
  config?: AxiosRequestConfig
): Promise<ItemsResponse> => {
  const newFolder = {
    type: LibraryItemType.Folder,
    parentId,
    title
  }

  const { data } = await api.post<ItemsResponse>(LIBRARY_API_PATH, [newFolder], {
    ...defaultConfig,
    ...config
  })

  return data
}

export const useCreateNewFolder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createNewFolder,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryQueryKey })
    }
  })
}

/* UPDATE ITEM */

const updateItem = async (
  { id, title, parentId, type, documentId, link }: LibraryItem,
  config?: AxiosRequestConfig
): Promise<void> => {
  const updatedItem: LibraryItemUpdate = {
    id,
    title,
    parentId,
    type,
    documentId,
    link
  }

  await api.put<void, LibraryItemUpdate>(`${LIBRARY_API_PATH}/${id}`, updatedItem, {
    ...defaultConfig,
    ...config
  })
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateItem,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryQueryKey })
    }
  })
}

/* DELETE ITEM */

const deleteItem = async (id: string, config?: AxiosRequestConfig): Promise<void> => {
  await api.delete<void>(`${LIBRARY_API_PATH}/${id}`, {
    ...defaultConfig,
    ...config
  })
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteItem,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryQueryKey })
    }
  })
}
