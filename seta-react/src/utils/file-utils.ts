export const downloadFile = (data: Blob, fileName: string) => {
  // Create a temporary URL to the download blob
  const href = URL.createObjectURL(data)

  // Create a temporary link element to trigger the download
  const link = document.createElement('a')

  link.href = href
  link.setAttribute('download', fileName)

  link.dataset.downloadurl = [data.type, link.download, link.href].join(':')

  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}
