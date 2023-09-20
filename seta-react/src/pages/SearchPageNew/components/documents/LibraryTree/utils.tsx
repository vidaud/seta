import type { LibraryItem } from '~/types/library/library-item'

/**
 * Returns the last two elements of the folder path as an array of div elements
 * @param folder The folder to get the path from
 * @returns The last two elements of the folder path, preceded by an ellipsis if the path is longer than 2 elements
 */
export const getFolderPath = (folder?: LibraryItem) => {
  const path = ['My Library', ...(folder?.path ?? [])]

  // Take the last two elements of the path
  // eslint-disable-next-line react/no-array-index-key
  const lastPath = path.slice(-2).map((p, index) => <div key={index}>{p}</div>)

  // Add an ellipsis if the path is longer than 2 elements
  if (path.length > 2) {
    lastPath.unshift(<div key={-1}>...</div>)
  }

  return lastPath
}
