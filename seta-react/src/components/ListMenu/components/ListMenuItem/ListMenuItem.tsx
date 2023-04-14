import { Box } from '@mantine/core'

import * as S from './styles'

type ListMenuItemProps = {
  className?: string
  label: string
  value: string
}

const ListMenuItem = ({ className, label, value }: ListMenuItemProps) => {
  return (
    <Box className={className} css={S.root} component="button" type="button" role="menuitem">
      {label}
    </Box>
  )
}

export default ListMenuItem
