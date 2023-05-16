export const dateFormatted = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

  return new Date(date).toLocaleDateString('en-GB', options)
}
