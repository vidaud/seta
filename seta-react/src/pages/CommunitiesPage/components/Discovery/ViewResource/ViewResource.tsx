import { useEffect, useState } from 'react'
import { Grid, Table, Text, Title, createStyles, Card } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourceID } from '../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../common/ComponentLoading'

const useStyles = createStyles(theme => ({
  title: {
    textAlign: 'left'
  },
  text: {
    textAlign: 'left'
  },
  table: {
    width: '100%',
    paddingTop: '1%'
  },
  td: {
    width: '50%'
  },
  button: {
    background: '#F8AE21'
  },
  imageSection: {
    background: '#D9D9D9',
    padding: theme.spacing.sm,
    color: '#000000'
  }
}))

const ViewResource = () => {
  const { classes } = useStyles()
  const { id } = useParams()

  const { data, isLoading } = useResourceID(id)
  const [rows, setRows] = useState(data)

  useEffect(() => {
    if (data) {
      setRows(data)
    }
  }, [data, rows])

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  return (
    <>
      <Grid grow>
        <Grid.Col span={12}>
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>
            <Title order={5} className={classes.title}>
              {rows?.title}
            </Title>
            <Text size="xs" className={classes.text}>
              Abstract: {rows?.abstract}
            </Text>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Community: {rows?.community_id}</Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>Status: {rows?.status}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Created by: {rows?.creator_id}</Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>Created at: {rows?.created_at.toString()}</Text>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}

export default ViewResource
