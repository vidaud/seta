import { Resource } from './resource.model'

export class User extends Resource {
  email?: string
  firstName?: string
  lastName?: string
  username?: string

  constructor(data?: Partial<User>) {
    super()
    Object.assign(this, data)
  }
}
