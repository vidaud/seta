import type { ReactNode, Ref } from 'react'
import { forwardRef, memo } from 'react'

import type { SvgIconProps } from '../components/SvgIcon'
import SvgIcon from '../components/SvgIcon'

/**
 * Creates an SVG icon component.
 *
 * @param displayName The name of the icon, used to generate the display name
 * @param iconProps The initial props to pass to the icon component
 * @param path The SVG path element to render
 * @returns The SVG icon
 */
export const createSvgIcon = (
  displayName: string,
  iconProps: Partial<SvgIconProps>,
  path: ReactNode
): typeof SvgIcon => {
  const iconName = `${displayName}Icon`

  const Icon = (props: SvgIconProps, ref: Ref<SVGSVGElement>) => (
    <SvgIcon ref={ref} {...iconProps} {...props}>
      {path}
    </SvgIcon>
  )

  Icon.displayName = iconName

  return memo(forwardRef<SVGSVGElement, SvgIconProps>(Icon))
}
