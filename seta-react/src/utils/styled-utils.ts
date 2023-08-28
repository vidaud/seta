import type { CreateStyled } from '@emotion/styled'

/**
 * This is a helper configuration to create a styled component with transient props.
 *
 * Any prop that starts with `$` will not be passed to the DOM element.
 *
 * Pass this as the second argument to `styled` from `@emotion/styled`.
 *
 * @example
 * const MyStyledComponent = styled(MyComponent, transientProps)
 */
export const transientProps: Parameters<CreateStyled>[1] = {
  shouldForwardProp: prop => prop !== 'theme' && !prop.startsWith('$')
}
