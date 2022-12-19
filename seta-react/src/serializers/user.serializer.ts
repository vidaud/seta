import { User } from "../models/user.model";
import { Serializer } from "./serializer.interface";

export class UserSerializer implements Serializer {
  fromJson(json: any): User {
    let user = new User();
    user.email = json?.email
    user.firstName = json?.first_name
    user.lastName = json?.last_name
    user.username = json?.username
    return user
  }

  toJson(user: User) {
    return JSON.stringify(user);
  }
}