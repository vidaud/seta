import { User } from "../models/user.model";
import { Serializer } from "./serializer.interface";

export class UserSerializer implements Serializer {
  fromJson(json: any): User {
    let user = new User();
    // user.assuranceLevel = json?.assuranceLevel
    // user.authenticationDate = json?.authenticationDate
    // user.authenticationFactors = json?.authenticationFactors
    // user.authenticationLevel = json?.authenticationLevel
    // user.departmentNumber = json?.departmentNumber
    // user.domain = json?.domain
    // user.domainUsername = json?.domainUsername
    user.email = json?.email
    // user.employeeNumber = json?.employeeNumber
    // user.employeeType = json?.employeeType
    user.firstName = json?.first_name
    // user.groups = json?.groups
    // user.isFromNewLogin = json?.isFromNewLogin
    user.lastName = json?.last_name
    // user.locale = json?.locale
    // user.longTermAuthenticationRequestTokenUsed = json?.longTermAuthenticationRequestTokenUsed
    // user.orgId = json?.orgId
    // user.strengths = json?.strengths
    // user.telephoneNumber = json?.telephoneNumber
    // user.teleworkingPriority = json?.teleworkingPriority
    // user.ticketType = json?.ticketType
    // user.uid = json?.uid
    user.username = json?.username
    return user
  }

  toJson(user: User) {
    return JSON.stringify(user);
  }
}