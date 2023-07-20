import type { ComponentProps, MouseEventHandler, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { Transition, type ActionIcon } from '@mantine/core'

import type { Color, Variant } from '~/types/lib-props'

import * as S from './styles'

type Variants = {
  variant: Variant
  activeVariant?: Variant
  hoverVariant?: Variant
  toggledVariant?: Variant
}

type Colors = {
  color: Color
  activeColor?: Color
  hoverColor?: Color
  toggledColor?: Color
}

const getCurrentVariant = (
  isActive: boolean | undefined,
  isToggled: boolean | undefined,
  { variant, activeVariant, hoverVariant, toggledVariant }: Variants
): Variant =>
  isToggled
    ? toggledVariant ?? hoverVariant ?? variant
    : isActive
    ? activeVariant ?? variant
    : variant

const getCurrentColor = (
  isActive: boolean | undefined,
  isToggled: boolean | undefined,
  { color, activeColor, hoverColor, toggledColor }: Colors
): Color =>
  isToggled ? toggledColor ?? hoverColor ?? color : isActive ? activeColor ?? color : color

const getHoverColor = (
  isToggled: boolean | undefined,
  { color, hoverColor, toggledColor }: Colors
): Color => (isToggled ? toggledColor ?? hoverColor ?? color : hoverColor ?? color)

type Props = ComponentProps<typeof ActionIcon<'button'>> & {
  hoverVariant?: Variant
  hoverColor?: Color
  activeVariant?: Variant
  activeColor?: Color
  isActive?: boolean
  toggledVariant?: Variant
  toggledColor?: Color
  isToggleButton?: boolean
  toggled?: boolean
  toggledIcon?: ReactNode
  onToggle?: (toggled: boolean) => void
}

/**
 * A wrapper around ActionIcon that changes its variant and color on hover and active states.
 * It also supports toggling.
 */
const ActionIconExtended = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant,
      hoverVariant,
      color,
      hoverColor,
      activeVariant,
      activeColor,
      isActive,
      toggledColor,
      toggledVariant,
      toggled,
      isToggleButton = toggled !== undefined,
      toggledIcon,
      onToggle,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [isToggled, setIsToggled] = useState(toggled ?? false)

    const colors: Colors = {
      color,
      activeColor,
      hoverColor,
      toggledColor
    }

    const currentVariant = getCurrentVariant(isActive, isToggled, {
      variant,
      activeVariant,
      hoverVariant,
      toggledVariant
    })

    const currentColor = getCurrentColor(isActive, isToggled, colors)
    const hoveredColor = getHoverColor(isToggled, colors)

    const toggle = () => setIsToggled(prev => !prev)

    useEffect(() => {
      if (isToggleButton) {
        setIsToggled(toggled ?? false)
      }
    }, [isToggleButton, toggled])

    const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
      e.stopPropagation()

      if (isToggleButton) {
        toggle()
        onToggle?.(!isToggled)
      }

      onClick?.(e)
    }

    const content = isToggleButton ? (
      <Transition mounted={!isToggled} transition="scale">
        {styles => (
          <div css={S.iconWrapper} style={styles}>
            {children}
          </div>
        )}
      </Transition>
    ) : (
      children
    )

    const toggledContent = isToggleButton && (
      <Transition mounted={isToggled} transition="scale">
        {styles => (
          <div css={S.iconWrapper} style={styles}>
            {toggledIcon}
          </div>
        )}
      </Transition>
    )

    return (
      <S.StyledActionIcon
        ref={ref}
        {...props}
        className="seta-ActionIconExtended-root"
        variant={currentVariant}
        color={currentColor}
        onClick={handleClick}
        data-toggled={isToggled || undefined}
        $hoverVariant={hoverVariant ?? currentVariant}
        $hoverColor={hoveredColor ?? currentColor}
        $toggledVariant={toggledVariant ?? hoverVariant ?? currentVariant}
        $toggledColor={toggledColor ?? hoveredColor ?? currentColor}
      >
        {content}
        {toggledContent}
      </S.StyledActionIcon>
    )
  }
)

export default ActionIconExtended
