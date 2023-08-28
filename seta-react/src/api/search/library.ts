import type { QueryKey } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { mockRawLibraryItems } from '~/api/search/mocks'
import type { LibraryItemRaw } from '~/types/library/library-item'

export type LibraryResponse = {
  items: LibraryItemRaw[]
}

export type NewFolderResponse = {
  item: LibraryItemRaw
}

export type SaveDocumentsPayload = {
  parentId: string | null
  documents: {
    documentId: string
    title: string
    link?: string
  }[]
}

export type CreateNewFolderPayload = {
  parentId: string | null
  title: string
}

const mockData = [...mockRawLibraryItems]

export const libraryQueryKey: QueryKey = ['library']

const getLibraryItems = async (config?: AxiosRequestConfig): Promise<LibraryResponse> =>
  // TODO: Replace with real API call
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        items: [...mockData]
      })
    }, 500)
  })

export const useLibrary = () => {
  return useQuery({
    queryKey: libraryQueryKey,
    queryFn: getLibraryItems
  })
}

const getNextId = (data: LibraryItemRaw[]) =>
  1 +
  data.reduce((acc, { id }) => {
    const idNumber = parseInt(id)

    return idNumber > acc ? idNumber : acc
  }, 0)

// Returns the library after saving the documents
const saveDocuments = async (
  { parentId, documents }: SaveDocumentsPayload,
  config?: AxiosRequestConfig
): Promise<LibraryResponse> => {
  // TODO: Replace the code below with the real API call

  const rawData = mockData
  const nextId = getNextId(rawData)

  if (!parentId) {
    const rootItems = rawData.filter(item => !item.parentId)
    const lastItem = rootItems[rootItems.length - 1]

    rawData.push(
      ...documents.map<LibraryItemRaw>(({ documentId, title, link }, index) => ({
        id: `${nextId + index}`,
        order: lastItem.order + 1,
        parentId: null,
        type: 'document',
        title,
        documentId,
        link
      }))
    )
  } else {
    rawData.push(
      ...documents.map<LibraryItemRaw>(({ documentId, title, link }, index) => ({
        id: `${nextId + index}`,
        order: 0,
        parentId,
        type: 'document',
        title,
        documentId,
        link
      }))
    )
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        items: rawData
      })
    }, 500)
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

const createNewFolder = async (
  { parentId, title }: CreateNewFolderPayload,
  config?: AxiosRequestConfig
): Promise<NewFolderResponse> => {
  const rawData = mockData
  const nextId = getNextId(rawData)

  const newFolder: LibraryItemRaw = {
    id: `${nextId}`,
    order: -1,
    parentId,
    type: 'folder',
    title
  }

  rawData.push(newFolder)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        item: newFolder
      })
    }, 500)
  })
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
