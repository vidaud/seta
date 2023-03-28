import type { Serializer } from './serializer.interface'

import { User } from '../models/user.model'

export class UserSerializer implements Serializer {
  fromJson(json: any): User {
    const user = new User()

    user.email = json?.email
    user.firstName = json?.first_name
    user.lastName = json?.last_name
    user.username = json?.username

    return user
  }

  toJson(user: User) {
    return JSON.stringify(user)
  }
}
