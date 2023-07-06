export enum TokenOperator {
  AND = 'AND',
  OR = 'OR'
}

export enum TokenType {
  WORD = 'WORD',
  EXPRESSION = 'EXPRESSION',
  OPERATOR = 'OPERATOR'
}

export type Token = {
  token: string
  rawValue: string
  index: number
  type: TokenType
  operator?: TokenOperator
  spacesAfter?: number
}

export type TokenMatch = Token & {
  word: string
}
