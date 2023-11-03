import { useEffect } from 'react'
import { Badge, Box, Table, Text, createStyles, useMantineTheme } from '@mantine/core'

import { useApplicationsList } from '~/api/user/applications'

import UpdateApplication from '../UpdateApplication'

const statusColors: Record<string, string> = {
  active: 'green',
  disabled: 'gray',
  blocked: 'yellow',
  deleted: 'cyan'
}

const useStyles = createStyles(() => ({
  box: {
    backgroundColor: '#f8f8ff',
    [`@media only screen and (min-width: 520px) and (max-width: 712px) and (orientation: portrait)`]:
      {
        wordBreak: 'break-word'
      }
  },
  td: {
    maxWidth: '25rem'
  }
}))

const ApplicationsList = ({ onChange }) => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const { data } = useApplicationsList()

  useEffect(() => {
    if (data) {
      onChange(data?.length)
    }
  }, [data, onChange])

  const apps = data?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{element.name}</td>
      <td className={classes.td}>{element.description}</td>
      <td>{element.user_id}</td>
      <td>
        <Badge
          size="md"
          color={statusColors[element?.status.toLowerCase()]}
          variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
        >
          {element?.status.toUpperCase()}
        </Badge>
      </td>
      <td>
        <UpdateApplication application={element} />
      </td>
    </tr>
  ))

  return (
    <>
      {data && data?.length > 0 ? (
        <Box className={classes.box} p="md">
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>User</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{apps}</tbody>
          </Table>
        </Box>
      ) : (
        <Box style={{ backgroundColor: '#f8f8ff' }} p="md">
          <Text color="gray.6">You don't have any applications.</Text>
        </Box>
      )}
    </>
  )
}

export default ApplicationsList
