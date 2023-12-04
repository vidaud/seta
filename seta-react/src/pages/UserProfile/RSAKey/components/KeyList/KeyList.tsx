import { useEffect } from 'react'
import { Box, Table, createStyles } from '@mantine/core'

import { useApplicationsList } from '~/api/user/applications'

import KeyDetails from './components/KeyDetails/KeyDetails'

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

const KeysList = ({ onChange }) => {
  const { classes } = useStyles()
  const { data } = useApplicationsList()

  useEffect(() => {
    if (data) {
      onChange(data?.length)
    }
  }, [data, onChange])

  const apps = data?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <KeyDetails key={index} props={element} />
  ))

  return (
    <>
      {data && data?.length > 0 ? (
        <Box className={classes.box} p="md">
          <Table>
            <tbody>{apps}</tbody>
          </Table>
        </Box>
      ) : (
        <Box className={classes.box} p="md">
          No items
        </Box>
      )}
    </>
  )
}

export default KeysList
