export type ChildrenProp = {
  children: React.ReactElement
}

export type PropsWithChildren<P> = P & ChildrenProp
