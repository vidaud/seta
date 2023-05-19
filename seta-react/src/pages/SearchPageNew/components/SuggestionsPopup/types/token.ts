export type Token = {
  token: string
  rawValue: string
  index: number
  isExpression?: boolean
  spacesAfter?: number
}

export type TokenMatch = Token & {
  word: string
}
