import type { CSSProperties, ReactNode } from 'react'

export type ChildrenProp = {
  children: ReactNode
}

export type PropsWithChildren<P> = P & ChildrenProp

export type ClassNameProp = {
  className?: string
}

export type ClassAndChildrenProps = ClassNameProp & ChildrenProp

export type ClassAndStyleProps = ClassNameProp & {
  style?: CSSProperties
}
