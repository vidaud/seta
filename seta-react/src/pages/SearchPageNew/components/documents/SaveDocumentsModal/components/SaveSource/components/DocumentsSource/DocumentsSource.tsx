import { ActionIcon, Flex, Popover, ScrollArea, Stack, Text } from '@mantine/core'
import { CgFileDocument } from 'react-icons/cg'
import { FaInfoCircle } from 'react-icons/fa'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import type { Document } from '~/types/search/documents'

import * as S from './styles'

type Props = {
  documents: Document[] | StagedDocument[]
}

const DocumentsSource = ({ documents }: Props) => {
  const count = documents.length

  const label = count === 1 ? documents[0].title : `${count} documents`

  const docsInfo = count > 1 && (
    <Popover
      withArrow
      arrowSize={12}
      offset={4}
      withinPortal
      shadow="md"
      classNames={S.docsInfoStyles().classes}
    >
      <Popover.Target>
        <ActionIcon>
          <FaInfoCircle size={18} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <ScrollArea.Autosize mah={400}>
          <Stack spacing="xs" py="md" px="lg">
            {documents.map((doc: StagedDocument) => (
              <Text key={doc.id} size="sm">
                {doc.title}
              </Text>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  )

  return (
    <Flex gap="xs" align="center">
      <CgFileDocument css={S.fileIcon} />

      <Text>{label}</Text>

      {docsInfo}
    </Flex>
  )
}

export default DocumentsSource
