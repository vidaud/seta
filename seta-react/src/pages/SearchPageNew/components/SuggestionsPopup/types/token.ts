export type Token = {
  token: string
  index: number
  isExpression?: boolean
  spacesAfter?: number
}

export type TokenMatch = Token & {
  word: string
}
