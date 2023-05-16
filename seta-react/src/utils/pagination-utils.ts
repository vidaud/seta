export const pagesCount = (totalRecords: number, perPage: number) =>
  Math.ceil(totalRecords / perPage)

export const getOffset = (page: number, perPage: number) => (page - 1) * perPage
