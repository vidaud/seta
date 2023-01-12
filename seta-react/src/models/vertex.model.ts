import { Resource } from './resource.model'

export class Vertex extends Resource {
  cardinality: string
  similarWord: string
  similarity: string
  constructor(data?: Partial<Vertex>) {
    super()
    Object.assign(this, data)
  }
}