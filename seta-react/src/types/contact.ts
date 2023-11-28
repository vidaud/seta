export type ContactIconVariant = 'white' | 'gradient'

export interface ContactIconStyles {
  variant: ContactIconVariant
}
export interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>
  title: React.ReactNode
  description: React.ReactNode
  variant?: ContactIconVariant
}
