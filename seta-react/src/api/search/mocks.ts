import type { LibraryItemRaw } from '~/types/library/library-item'

export const mockRawLibraryItems: LibraryItemRaw[] = [
  {
    id: '1',
    parentId: null,
    type: 'folder',
    title: 'Environment',
    order: 0
  },
  {
    id: '2',
    parentId: '1',
    type: 'document',
    documentId: 'doc1',
    link: 'https://www.google.com',
    title: 'Cities',
    order: 0
  },
  {
    id: '3',
    parentId: '1',
    type: 'folder',
    title: 'Wildlife',
    order: 1
  },
  {
    id: '4',
    parentId: '3',
    type: 'folder',
    title: 'North Europe',
    order: 0
  },
  {
    id: '5',
    parentId: '4',
    type: 'document',
    documentId: 'doc3',
    link: 'https://www.google.com',
    title: 'Norway',
    order: 0
  },
  {
    id: '6',
    parentId: '4',
    type: 'document',
    documentId: 'doc4',
    link: 'https://www.google.com',
    title: 'Sweden',
    order: 1
  },
  {
    id: '7',
    parentId: '4',
    type: 'document',
    documentId: 'doc5',
    link: 'https://www.google.com',
    title: 'Finland',
    order: 2
  },
  {
    id: '8',
    parentId: '4',
    type: 'document',
    documentId: 'doc6',
    link: 'https://www.google.com',
    title: 'Denmark',
    order: 3
  },
  {
    id: '9',
    parentId: '3',
    type: 'folder',
    title: 'Lakes',
    order: 1
  },
  {
    id: '10',
    parentId: '9',
    type: 'document',
    documentId: 'doc7',
    link: 'https://www.google.com',
    title: 'Lake Superior',
    order: 0
  },
  {
    id: '11',
    parentId: '9',
    type: 'document',
    documentId: 'doc8',
    link: 'https://www.google.com',
    title: 'Lake Victoria',
    order: 1
  },
  {
    id: '12',
    parentId: '3',
    type: 'folder',
    title: 'Mountains',
    order: 2
  },
  {
    id: '13',
    parentId: '3',
    type: 'folder',
    title: 'Forests',
    order: 3
  },
  {
    id: '14',
    parentId: null,
    type: 'folder',
    title: 'Animals',
    order: 1
  },
  {
    id: '15',
    parentId: '14',
    type: 'document',
    documentId: 'doc9',
    link: 'https://www.google.com',
    title: 'The Lion',
    order: 0
  },
  {
    id: '16',
    parentId: '14',
    type: 'document',
    documentId: 'doc10',
    link: 'https://www.google.com',
    title: 'The Tiger',
    order: 1
  },
  {
    id: '17',
    parentId: null,
    type: 'document',
    documentId: 'doc11',
    link: 'https://www.google.com',
    title: 'Multimedia generator',
    order: 2
  }
]
