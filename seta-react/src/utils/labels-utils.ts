import type { Label } from '~/types/search/annotations'

/**
 * Finds labels that start with the given search string, case-insensitive.
 *
 * Also matches labels that have the same category as a label that matches the search string.
 *
 * Also matches all labels in a category that matches the search string.
 * @param labels The array of labels to search through
 * @param search The search string to match against label names and categories
 * @returns An array of labels that match the search string or undefined if there are no labels.
 */
export const findLabels = (labels: Label[] | undefined, search: string) => {
  if (!labels) {
    return undefined
  }

  if (!search) {
    return labels
  }

  const searchLowercase = search.toLowerCase()

  return labels.filter(label => {
    const nameLowercase = label.name.toLowerCase()
    const categoryLowercase = label.category.toLowerCase()

    return (
      nameLowercase.startsWith(searchLowercase) ||
      categoryLowercase.startsWith(searchLowercase) ||
      labels.some(
        otherLabel =>
          otherLabel.category === label.category &&
          otherLabel.name.toLowerCase().startsWith(searchLowercase)
      )
    )
  })
}
