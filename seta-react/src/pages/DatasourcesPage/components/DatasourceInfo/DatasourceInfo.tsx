import { Flex, Text, Group, useMantineTheme, Anchor, Tooltip, Divider } from '@mantine/core'
import { IconCalendarTime } from '@tabler/icons-react'
import { IoMdLink } from 'react-icons/io'
import { MdEmail } from 'react-icons/md'
import { VscSearch, VscSearchStop } from 'react-icons/vsc'

import type { DatasourcesResponse } from '~/api/types/datasource-types'

import ThemeList from './components/ThemeList/ThemeList'
import * as S from './styles'

import UnsearchableDatasources from '../UnsearchableDatasources'

type Props = {
  queryTerms: string
  datasource: DatasourcesResponse
}

const DatasourceInfo = ({ datasource }: Props) => {
  const theme = useMantineTheme()
  const { id, title, description, organisation, contact, searchable, created } = datasource
  const mailTo = `mailto:${contact?.email}`

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
            {title?.charAt(0).toUpperCase() + title?.slice(1)}
          </Text>
        </div>
        <UnsearchableDatasources
          datasource={datasource}
          searchable={searchable ? searchable : true}
        />
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Text size="md">{description?.charAt(0).toUpperCase() + description?.slice(1)}</Text>
        <Group css={S.group}>
          <Tooltip label="Datasource ID">
            <Text size="sm">{id}</Text>
          </Tooltip>
          <Divider size="sm" orientation="vertical" />
          <Tooltip label="Organization Name">
            <Text size="sm">{organisation?.charAt(0).toUpperCase() + organisation?.slice(1)}</Text>
          </Tooltip>
          {created ? (
            <Group css={S.group}>
              <Divider size="sm" orientation="vertical" />
              <IconCalendarTime size="1.2rem" color="gray" />
              <Text size="sm">{new Date(created)?.toDateString()}</Text>
            </Group>
          ) : null}
        </Group>
        <Group>
          <Group css={S.group} w="60%">
            <MdEmail size={18} />
            <Text size="sm" color="gray.7" pr="md">
              {contact?.person}
              {': '}
              <Anchor href={mailTo} target="_blank">
                {contact?.email}
              </Anchor>
            </Text>
            {contact?.website ? (
              <>
                <IoMdLink size={18} />
                <Text size="sm" color="gray.7">
                  <Anchor href={contact?.website} target="_blank">
                    {contact?.website}
                  </Anchor>
                </Text>
              </>
            ) : null}
          </Group>
          <ThemeList themes={datasource.theme ? datasource.theme : '-'} width="38%" />
        </Group>
      </Flex>
    </div>
  )
}

export default DatasourceInfo
