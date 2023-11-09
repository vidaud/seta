import { useRef, useState } from 'react'
import { Button, Card, Flex, Group, Text, Title } from '@mantine/core'
import { IconCheckbox } from '@tabler/icons-react'

import {
  useUpdateApplicationsPermissions,
  type ApplicationPermissions
} from '~/api/user/applications-permissions'
import type { CategoryScopesResponse } from '~/types/catalogue/catalogue-scopes'

import { useApplicationContext } from '../../contexts/application-context'
import PermsTable from '../PermsTable'

type Props = {
  resourceScope: ApplicationPermissions
  catalogue?: CategoryScopesResponse[]
  appName: string
  allPerms: ApplicationPermissions[]
}

const PermCard = ({ resourceScope, catalogue, appName, allPerms }: Props) => {
  const [selection, setSelection] = useState<string[]>(resourceScope.scopes)
  const updatePermissionsMutation = useUpdateApplicationsPermissions(appName)
  const [saveDisabled, setSaveDisabled] = useState(true)
  const { handleSavePermissions, permModified } = useApplicationContext()
  const initialRef = useRef({
    resourceId: resourceScope.resourceId,
    scopes: resourceScope.scopes
  })

  const toggleRow = (code: string) => {
    const values = selection?.includes(code)
      ? selection?.filter(item => item !== code)
      : [...selection, code]

    setSaveDisabled(
      !permModified(initialRef.current, { resourceId: resourceScope.resourceId, scopes: values })
    )

    setSelection(values)
  }
  const toggleAll = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any =
      selection?.length === catalogue?.length ? [] : catalogue?.map(item => item.code)

    setSaveDisabled(
      !permModified(initialRef.current, { resourceId: resourceScope.resourceId, scopes: values })
    )

    setSelection(values)
  }

  return (
    <Card shadow="xs" padding="md" radius="xs" withBorder>
      <Group>
        <Flex>
          <Title order={5}>
            <Text span c="dimmed" size="sm" mr={5}>
              Title
            </Text>
            {resourceScope.title}
          </Title>{' '}
          {'>'}{' '}
          <Title order={5}>
            <Text span c="dimmed" size="sm" mr={5}>
              Resource
            </Text>
            {resourceScope.resourceId}
          </Title>{' '}
          {'>'}{' '}
          <Title order={5}>
            <Text span c="dimmed" size="sm" mr={5}>
              Community
            </Text>
            {resourceScope.communityId}
          </Title>
        </Flex>
        <Button
          variant="light"
          color="teal.4"
          leftIcon={<IconCheckbox size="1rem" />}
          disabled={saveDisabled}
          onClick={() =>
            handleSavePermissions(updatePermissionsMutation, allPerms, resourceScope, selection)
          }
        >
          Save
        </Button>
      </Group>

      <PermsTable
        catalogue={catalogue}
        selection={selection}
        toggleRow={toggleRow}
        toggleAll={toggleAll}
      />
    </Card>
  )
}

export default PermCard
