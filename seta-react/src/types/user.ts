export type User = {
  email: string
  firstName: string
  lastName: string
  role: string
  username: string
}

export enum UserRole {
  User = 'user',
  Administrator = 'administrator'
}
