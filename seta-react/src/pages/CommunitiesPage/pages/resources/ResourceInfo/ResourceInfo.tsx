import { createRef, useEffect } from 'react'
import { Flex, Text, clsx, Group, Anchor, Menu, ActionIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconDotsVertical } from '@tabler/icons-react'
import { CgSearchFound } from 'react-icons/cg'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineSearchOff } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

import type { ResourceResponse } from '~/api/types/resource-types'

import DeleteResource from './components/DeleteResource/DeleteResource'
import ResourceDetails from './components/ResourceDetails/ResourceDetails'
import RestrictedResource from './components/RestrictedResources/RestrictedResources'
import UpdateResource from './components/UpdateResource/UpdateResource'
import * as S from './styles'

import type { CommunityScopes, ResourceScopes, SystemScopes } from '../../contexts/scope-context'

type Props = {
  queryTerms: string
  resource: ResourceResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceInfo = ({ resource, resource_scopes }: Props) => {
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
    //prevent entering infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCommunityRedirection = () => {
    navigate(`/communities/#${community_id}`)
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
          <CgSearchFound size={26} color="green" />
        ) : (
          <MdOutlineSearchOff size={26} color="blue" />
        )}
        <div css={S.title}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
        </div>
        <Menu
          transitionProps={{ transition: 'pop' }}
          withArrow
          position="left"
          closeOnClickOutside={false}
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
            <RestrictedResource resource={resource} resource_scopes={resource_scopes} />
            <UpdateResource resource={resource} resource_scopes={resource_scopes} />
            <DeleteResource id={resource_id} resource_scopes={resource_scopes} />
          </Menu.Dropdown>
        </Menu>

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
        <ResourceDetails
          css={S.details}
          open={detailsOpen}
          resource={resource}
          resource_scopes={resource_scopes}
        />
      )}
    </div>
  )
}

export default ResourceInfo
