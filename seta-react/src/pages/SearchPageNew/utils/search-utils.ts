import type { Token } from '~/pages/SearchPageNew/types/token'

export const buildSearchQuery = (tokens: Token[]): string => {
  return tokens.map(({ token }) => token).join(' OR ')
}
