export const extractText = value => {
  const text = value.split('/').filter(element => element !== 'seta')

  const extractedText = text.join(' ').split('_').join(' ')

  return extractedText
}

export const downLoadFile = (data, headers, filename: string) => {
  const link = document.createElement(`a`)
  const blob = new Blob([data], {
    type: typeof headers === 'object' ? headers.get(`Content-Type`) : headers
  })

  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(link.href)
}
