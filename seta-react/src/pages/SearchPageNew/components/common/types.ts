export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SizeProp = {
  size?: Size
}

export const IconSize: { readonly [key in Size]: number } = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56
}
