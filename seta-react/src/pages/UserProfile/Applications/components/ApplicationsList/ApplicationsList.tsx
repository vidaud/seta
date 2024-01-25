import { useEffect } from 'react'
import { Box, Table, Text, createStyles } from '@mantine/core'

import { useApplicationsList } from '~/api/user/applications'

import ApplicationsRow from './components/ApplicationRow/ApplicationRow'

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
  const { data } = useApplicationsList()

  useEffect(() => {
    if (data) {
      onChange(data?.length)
    }
  }, [data, onChange])

  const apps = data?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ApplicationsRow key={index} props={element} />
  ))

  return (
    <>
      {data && data?.length > 0 ? (
        <Box className={classes.box} p="md">
          <Table>
            <thead>
              <tr>
                <th />
                <th>Provider</th>
                <th>Username</th>
                <th>Description</th>
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
