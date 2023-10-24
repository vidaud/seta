export const dateFormatted = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return new Date(date).toLocaleDateString('en-GB', options)
}

/**
 * Returns a timestamp in the format YYYYMMDDHHmmss
 */
export const getTimestamp = () => new Date().toISOString().replace(/(\..*$)|[-T:Z]/g, '')
