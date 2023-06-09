export const trimText = (text: string, width = 200): string =>
  text.length > width ? `${text.slice(0, width)}...` : text
