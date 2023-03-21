import { Resource } from './resource.model'

export class Cluster extends Resource {
  cluster: string
  words: string[]
  constructor(data?: Partial<Cluster>) {
    super()
    Object.assign(this, data)
  }
}
