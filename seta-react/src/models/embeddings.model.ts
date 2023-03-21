import { Resource } from './resource.model'

export class EmbeddingsModel extends Resource {
  vector: number[]
  version: string

  constructor(data?: Partial<EmbeddingsModel>) {
    super()
    Object.assign(this, data)
  }
}
