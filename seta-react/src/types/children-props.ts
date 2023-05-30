export type ChildrenProp = {
  children: React.ReactElement
}

export type PropsWithChildren<P> = P & ChildrenProp

export type ClassNameProp = {
  className?: string
}

export type ClassAndChildrenProps = ClassNameProp & ChildrenProp
