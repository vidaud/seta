export const downLoadJSON = (data, headers, filename: string) => {
  const link = document.createElement(`a`)
  const blob = new Blob([data], {
    type: typeof headers === 'object' ? headers.get(`mineType`) : headers
  })

  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(link.href)
}
