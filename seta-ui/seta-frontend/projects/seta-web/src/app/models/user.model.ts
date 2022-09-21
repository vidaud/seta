import { Resource } from "./resource.model";

export class User extends Resource {
  // assuranceLevel?: string;
  // authenticationDate?: string;
  // authenticationFactors?: string;
  // authenticationLevel?: string;
  // departmentNumber?: string;
  // domain?: string;
  // domainUsername?: string;
  email?: string;
  // employeeNumber?: string;
  // employeeType?: string;
  firstName?: string;
  // groups?: string;
  // isFromNewLogin?: string;
  lastName?: string;
  // locale?: string;
  // longTermAuthenticationRequestTokenUsed?: string;
  // orgId?: string;
  // strengths?: string;
  // telephoneNumber?: string;
  // teleworkingPriority?: string;
  // ticketType?: string;
  // uid?: string; // same as username, but to be easy to sync with the ECAS notation
  username?: string; // same as uid, but more logical field name

  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }
}
