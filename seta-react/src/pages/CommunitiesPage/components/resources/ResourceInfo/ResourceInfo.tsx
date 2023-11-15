import { createRef, useEffect, useState } from 'react'
import { Flex, Text, clsx, Group, Anchor, Menu, ActionIcon, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDotsVertical } from '@tabler/icons-react'
import { CgSearchFound } from 'react-icons/cg'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineSearchOff } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '~/pages/CommunitiesPage/contexts/community-list.context'
import { PanelProvider } from '~/pages/CommunitiesPage/contexts/panel-context'

import type { ResourceResponse } from '~/api/types/resource-types'

import DeleteResource from './components/DeleteResource'
import ResourceDetails from './components/ResourceDetails'
import RestrictedResource from './components/RestrictedResources'
import UpdateResource from './components/UpdateResource'
import * as S from './styles'

type Props = {
  queryTerms: string
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceInfo = ({ resource, resource_scopes, community_scopes }: Props) => {
  const [scopes, setScopes] = useState<string[] | undefined>([])
  const [resourceScopes, setResourceScopes] = useState<string[] | undefined>([])
  const [outsideClick, setOutsideClick] = useState(true)
  const theme = useMantineTheme()
  const { title, resource_id, abstract, community_title, created_at, community_id, searchable } =
    resource
  const location = useLocation()
  const ref = createRef<HTMLDivElement>()
  const navigate = useNavigate()

  const [detailsOpen, { toggle }] = useDisclosure()

  const chevronClass = clsx({ open: detailsOpen })
  const openClass = clsx({ open: detailsOpen })

  const hasDetails = !!community_id

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  useEffect(() => {
    if (location.hash === `#${resource_id.replace(/ /g, '%20')}`) {
      toggle()
      ref.current?.scrollIntoView()
    }

    const findResource = community_scopes?.filter(
      scope => scope.community_id === resource.community_id
    )

    findResource ? setScopes(findResource[0]?.scopes) : setScopes([])

    const findResourceScope = resource_scopes?.filter(
      scope => scope.resource_id === resource.resource_id
    )

    findResourceScope ? setResourceScopes(findResourceScope[0]?.scopes) : setResourceScopes([])
    //prevent entering infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCommunityRedirection = () => {
    navigate(`/community/communities/#${community_id}`)
  }

  const handleOutsideClick = value => {
    setOutsideClick(value)
  }

  return (
    <div css={S.root} className={openClass}>
      <div
        css={S.header}
        data-details={hasDetails}
        data-open={detailsOpen}
        onClick={toggle}
        ref={ref}
      >
        {searchable === true ? (
          <CgSearchFound size={26} color={theme.colors.teal[theme.fn.primaryShade()]} />
        ) : (
          <MdOutlineSearchOff size={26} color="orange" />
        )}
        <div css={S.title}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
        </div>
        {resourceScopes?.includes('/seta/resource/edit') ? (
          <>
            <RestrictedResource resource={resource} />
            <Menu
              transitionProps={{ transition: 'pop' }}
              withArrow
              position="left"
              closeOnClickOutside={outsideClick}
            >
              <Menu.Target>
                <ActionIcon
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <IconDotsVertical size="1rem" stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <UpdateResource resource={resource} onChange={handleOutsideClick} />
                <DeleteResource id={resource_id} />
              </Menu.Dropdown>
            </Menu>
          </>
        ) : (
          <>
            <div />
            <div />
          </>
        )}

        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Group sx={{ gap: '0.4rem' }}>
          <Text size="sm" onClick={() => handleCommunityRedirection()}>
            Community: {'  '}
            <Anchor
              onClick={e => {
                e.stopPropagation()
                handleCommunityRedirection()
              }}
            >
              {community_title.charAt(0).toUpperCase() + community_title.slice(1)}
            </Anchor>
          </Text>
          <Text size="sm">
            {'>'} ID: {resource_id.charAt(0).toUpperCase() + resource_id.slice(1)}
          </Text>
          <Text size="sm">
            {'>'} Created at: {new Date(created_at).toDateString()}
          </Text>
        </Group>
        <Text size="xs">{abstract.charAt(0).toUpperCase() + abstract.slice(1)}</Text>
      </Flex>

      {hasDetails && (
        <PanelProvider>
          <ResourceDetails
            css={S.details}
            open={detailsOpen}
            resource={resource}
            resource_scopes={resource_scopes}
            community_scopes={scopes}
          />
        </PanelProvider>
      )}
    </div>
  )
}

export default ResourceInfo
