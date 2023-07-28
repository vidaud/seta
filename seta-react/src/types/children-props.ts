import type { UserRole } from './user'

export type ChildrenProp = {
  children: React.ReactElement
}

export type PropsWithChildren<P> = P & ChildrenProp

export type ClassNameProp = {
  className?: string
}

export type ClassAndChildrenProps = ClassNameProp & ChildrenProp

export type AllowedRolesAndChildrenProps = { allowedRoles?: UserRole[] } & ChildrenProp
