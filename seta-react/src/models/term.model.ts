import type { SetaDocument } from './document.model'
import type { EmbeddingsModel } from './embeddings.model'
import { Resource } from './resource.model'

export class Term extends Resource {
  display: string
  value: string
  termType: TermType
  isOperator: boolean
  operator?: Operator
  document?: SetaDocument
  embeddings?: EmbeddingsModel
  file?: File
  text?: string

  constructor(data?: Partial<Term>) {
    super()
    Object.assign(this, data)
  }
}

export class Operator {
  index: number
  label: string
  code: string

  constructor(data?: Partial<Operator>) {
    Object.assign(this, data)
  }
}

export enum TermType {
  OPERATOR = 'Operator',
  DOCUMENT = 'Document',
  VERTEX = 'String'
}

export const Operators = {
  AND: 1,
  OR: 2,
  COMMA: 3,
  OPEN_PARENTHESIS: 4,
  CLOSE_PARENTHESIS: 5,
  properties: {
    1: new Operator({ index: 1, label: `AND`, code: ` AND ` }),
    2: new Operator({ index: 2, label: `OR`, code: ` OR ` }),
    3: new Operator({ index: 3, label: `, `, code: `,` }),
    4: new Operator({ index: 4, label: `( `, code: `(` }),
    5: new Operator({ index: 5, label: `)`, code: `)` })
  }
}
