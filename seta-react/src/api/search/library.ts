import type { QueryKey } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError, type AxiosRequestConfig } from 'axios'

import { mockRawLibraryItems } from '~/api/search/mocks'
import type { LibraryItemRaw } from '~/types/library/library-item'

export type LibraryResponse = {
  items: LibraryItemRaw[]
}

export type ItemResponse = {
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

export type UpdateItemPayload = LibraryItemRaw & {
  id: string
}

const mockData = [...mockRawLibraryItems]

export const libraryQueryKey: QueryKey = ['library']

/* GET ALL ITEMS */

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

/* SAVE DOCUMENTS */

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

/* CREATE NEW FOLDER */

const createNewFolder = async (
  { parentId, title }: CreateNewFolderPayload,
  config?: AxiosRequestConfig
): Promise<ItemResponse> => {
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

/* UPDATE ITEM */

const updateItem = async (
  { id, title, order, parentId, type, documentId, link }: UpdateItemPayload,
  config?: AxiosRequestConfig
): Promise<ItemResponse> => {
  const rawData = mockData

  const itemIndex = rawData.findIndex(item => item.id === id)

  if (itemIndex === -1) {
    throw new AxiosError(`Item with id ${id} not found`, AxiosError.ERR_BAD_REQUEST)
  }

  rawData[itemIndex] = {
    id,
    title,
    order,
    parentId,
    type,
    documentId,
    link
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        item: rawData[itemIndex]
      })
    }, 500)
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
  const rawData = mockData

  const itemIndex = rawData.findIndex(item => item.id === id)

  if (itemIndex === -1) {
    throw new AxiosError(`Item with id ${id} not found`, AxiosError.ERR_BAD_REQUEST)
  }

  const item = rawData[itemIndex]

  rawData.splice(itemIndex, 1)

  if (item.type === 'folder') {
    const children = rawData.filter(child => child.parentId === id)

    children.forEach(child => {
      deleteItem(child.id)
    })
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 500)
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
