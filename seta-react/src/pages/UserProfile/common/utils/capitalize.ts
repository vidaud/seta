export const capitalize = (text?: string): string | undefined => {
  if (!text) {
    return text
  }

  return (text && text[0].toUpperCase() + text.slice(1)) || text
}
