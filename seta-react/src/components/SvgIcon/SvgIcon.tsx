import type { ReactNode, SVGAttributes } from 'react'
import { forwardRef } from 'react'

export interface SvgIconProps extends SVGAttributes<SVGElement> {
  title?: string
  children?: ReactNode
}

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(function SvgIcon(
  { title, focusable = false, viewBox = '0 0 16 16', fill = 'none', role, children, ...rest },
  ref
) {
  const accessibilityRole = role ?? (title && 'img')
  const ariaHidden = title ? undefined : true

  return (
    <svg
      ref={ref}
      focusable={focusable}
      viewBox={viewBox}
      fill={fill}
      role={accessibilityRole}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {children}
      {title && <title>{title}</title>}
    </svg>
  )
})

export default SvgIcon
