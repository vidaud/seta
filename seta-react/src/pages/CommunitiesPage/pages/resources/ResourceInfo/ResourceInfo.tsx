import { Badge, Flex, Text, clsx, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CgSearchFound } from 'react-icons/cg'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineSearchOff } from 'react-icons/md'

import type { ResourceResponse } from '~/api/types/resource-types'

import DeleteResource from './components/DeleteResource/DeleteResource'
import ResourceDetails from './components/ResourceDetails/ResourceDetails'
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
  const { title, resource_id, abstract, searchable } = resource

  const [detailsOpen, { toggle }] = useDisclosure()

  const chevronClass = clsx({ open: detailsOpen })
  const openClass = clsx({ open: detailsOpen })

  const hasDetails = !!searchable

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  return (
    <div css={S.root} className={openClass}>
      <div css={S.header} data-details={hasDetails} data-open={detailsOpen} onClick={toggle}>
        {searchable === 'true' ? (
          <Tooltip label="Searchable Resource" color="green">
            <Badge variant="outline" color="green">
              <CgSearchFound />
            </Badge>
          </Tooltip>
        ) : (
          <Tooltip label="Not Searchable Resource" color="blue">
            <Badge variant="outline" color="blue">
              <MdOutlineSearchOff />
            </Badge>
          </Tooltip>
        )}
        <div css={(S.title, S.titleGroup)}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
          <UpdateResource resource={resource} resource_scopes={resource_scopes} />
        </div>
        <DeleteResource id={resource_id} resource_scopes={resource_scopes} />
        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Text size="xs">{abstract.charAt(0).toUpperCase() + abstract.slice(1)}</Text>
      </Flex>

      {hasDetails && (
        <ResourceDetails
          css={S.details}
          open={detailsOpen}
          id={resource_id}
          resource={resource}
          resource_scopes={resource_scopes}
        />
      )}
    </div>
  )
}

export default ResourceInfo
