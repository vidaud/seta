import { Flex, Breadcrumbs as MantineBreadcrumbs } from '@mantine/core'
import { AiOutlineHome } from 'react-icons/ai'
import { NavLink } from 'react-router-dom'

import * as S from './styles'

const Breadcrumbs = () => {
  // TODO: Add proper configurable breadcrumbs
  const crumbs = (
    <NavLink to="/" css={S.link}>
      <AiOutlineHome size="1.5rem" />
    </NavLink>
  )

  return (
    <Flex align="center" css={S.root}>
      <MantineBreadcrumbs>{crumbs}</MantineBreadcrumbs>
    </Flex>
  )
}

export default Breadcrumbs
