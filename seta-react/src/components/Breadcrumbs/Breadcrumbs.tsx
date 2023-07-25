import { Flex, Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core'
import { AiOutlineHome } from 'react-icons/ai'
import { BsChevronRight } from 'react-icons/bs'
import { Link, useLocation } from 'react-router-dom'

import type { Crumb } from '~/types/breadcrumbs'

import * as S from './styles'

const HOME_CRUMB: Crumb = {
  icon: <AiOutlineHome size="1.4rem" />,
  path: '/'
}

// const COMMUNITY_CRUMB: Crumb = {
//   title: 'Communities',
//   path: '/communities'
// }

const linksFromLocation = (location: string): Crumb[] => {
  const paths = location.split('/').filter(Boolean)

  return paths.map((value, index) => {
    const path = `/${paths.slice(0, index + 1).join('/')}`
    const title = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return {
      path,
      title
    }
  })
}

type Props = {
  crumbs?: Crumb[]
  excludeHome?: boolean
  readFromPath?: boolean
  includeCom?: boolean
}

const Breadcrumbs = ({ crumbs, readFromPath, excludeHome }: Props) => {
  const location = useLocation()

  const crumbValues = readFromPath || !crumbs ? linksFromLocation(location.pathname) : crumbs ?? []

  const values = excludeHome ? crumbValues : [HOME_CRUMB, ...crumbValues]

  const elements = values.map((crumb, index) => {
    const isLast = index === values.length - 1

    const { icon, path, title } = crumb

    const linkCss = isLast ? S.linkActive : S.link

    return (
      <Link to={path} css={linkCss} key={path}>
        <Flex align="center">
          {icon}
          {title && <Text size="sm">{title}</Text>}
        </Flex>
      </Link>
    )
  })

  return (
    <Flex align="center" css={S.root}>
      <MantineBreadcrumbs css={S.breadcrumbs} separator={<BsChevronRight />}>
        {elements}
      </MantineBreadcrumbs>
    </Flex>
  )
}

export default Breadcrumbs
