import { Flex, Text, Group, useMantineTheme, Anchor, Tooltip, Divider } from '@mantine/core'
import { IconCalendarTime } from '@tabler/icons-react'
import { IoMdLink } from 'react-icons/io'
import { MdEmail } from 'react-icons/md'
import { VscSearch, VscSearchStop } from 'react-icons/vsc'

import type { DatasourceResponse } from '~/api/types/datasource-types'

import ThemeList from './components/ThemeList/ThemeList'
import * as S from './styles'

import RestrictedDatasources from '../RestrictedDatasources'

type Props = {
  queryTerms: string
  datasource: DatasourceResponse
}

const DatasourceInfo = ({ datasource }: Props) => {
  const theme = useMantineTheme()
  const { title, resource_id, abstract, community_title, created_at, searchable, creator } =
    datasource
  const link_origin = 'https://localhost'
  const mailTo = `mailto:${creator?.email}`
  const label = 'adriana@gmail.com'

  return (
    <div css={S.root}>
      <div css={S.header}>
        <Tooltip
          label={searchable === true ? 'Searchable Datasource' : 'Not Searchable Datasource'}
        >
          <div>
            {searchable === true ? (
              <VscSearch
                size={26}
                color={theme.colors.teal[theme.fn.primaryShade()]}
                css={S.searchIcon}
              />
            ) : (
              <VscSearchStop size={26} color="orange" css={S.searchIcon} />
            )}
          </div>
        </Tooltip>
        <div css={S.title}>
          <Text fz="md" fw={600}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
        </div>
        <RestrictedDatasources datasource={datasource} searchable={searchable} />
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Text size="md">{abstract?.charAt(0).toUpperCase() + abstract?.slice(1)}</Text>
        <Group css={S.group}>
          <Tooltip label="Datasource ID">
            <Text size="sm">{resource_id}</Text>
          </Tooltip>
          <Divider size="sm" orientation="vertical" />
          <Tooltip label="Organization Name">
            <Text size="sm">
              {community_title.charAt(0).toUpperCase() + community_title.slice(1)}
            </Text>
          </Tooltip>
          <Group css={S.group}>
            <Divider size="sm" orientation="vertical" />
            <IconCalendarTime size="1.2rem" color="gray" />
            <Text size="sm">{new Date(created_at).toDateString()}</Text>
          </Group>
        </Group>
        <Group>
          <Group css={S.group} w="60%">
            <MdEmail size={18} />
            <Text size="sm" color="gray.7" pr="md">
              <Anchor href={mailTo} target="_blank">
                {label}
              </Anchor>
            </Text>

            <IoMdLink size={18} />
            <Text size="sm" color="gray.7">
              <Anchor href={link_origin} target="_blank">
                {link_origin}
              </Anchor>
            </Text>
          </Group>
          <ThemeList />
        </Group>
      </Flex>
    </div>
  )
}

export default DatasourceInfo
