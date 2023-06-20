import { useEffect, useState } from 'react'
import { Grid, Table, Text, Title, createStyles, Card } from '@mantine/core'
import { useParams } from 'react-router-dom'

import { useResourceID } from '../../../../../../../api/resources/manage/my-resource'
import ComponentLoading from '../../../../common/ComponentLoading'

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
      <Grid>
        <Grid.Col span={12}>
          <Card withBorder radius="md">
            <Card.Section className={classes.imageSection}>
              <Text size="md">Details</Text>
            </Card.Section>
            <Title order={5} className={classes.title}>
              {rows?.title ? rows?.title.charAt(0).toUpperCase() + rows?.title.slice(1) : null}
            </Title>
            <Text size="xs" className={classes.text}>
              Abstract:{' '}
              {rows?.abstract
                ? rows?.abstract.charAt(0).toUpperCase() + rows?.abstract.slice(1)
                : null}
            </Text>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Community:{' '}
                      {rows?.community_id
                        ? rows?.community_id.charAt(0).toUpperCase() + rows?.community_id.slice(1)
                        : null}
                    </Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>Status: {rows?.status.toUpperCase()}</Text>
                  </td>
                </tr>
                <tr>
                  <td className={classes.td}>
                    <Text className={classes.text}>Created by: {rows?.creator?.full_name}</Text>
                  </td>
                  <td className={classes.td}>
                    <Text className={classes.text}>
                      Created at:{' '}
                      {rows?.created_at ? new Date(rows?.created_at).toDateString() : null}
                    </Text>
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
