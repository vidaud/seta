import { useState } from 'react'
import { Grid, Paper, Table, Title, Text, ScrollArea } from '@mantine/core'

import { useUserPermissions } from '~/api/communities/user-scopes'

import { useStyles } from './style'

import { extractText } from '../common/utils/utils'

const Permissions = () => {
  const { cx, classes } = useStyles()
  const { data } = useUserPermissions()
  const [scrolled, setScrolled] = useState(false)
  const [scrolledH1, setScrolledH1] = useState(false)

  const systemPermissions = data?.system_scopes?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{element.area}</td>
      <td>{extractText(element.scope)}</td>
    </tr>
  ))

  const communityPermissions = data?.community_scopes?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{element.community_id}</td>
      <td>
        <>
          {element.scopes.map(item => (
            <Table key={item}>
              <tr>
                <td>{extractText(item)}</td>
              </tr>
            </Table>
          ))}
        </>
      </td>
    </tr>
  ))

  const resourcePermissions = data?.resource_scopes?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td>{element.resource_id}</td>
      <td>
        <>
          {element.scopes.map(item => (
            <Table key={item}>
              <tr>
                <td>{extractText(item)}</td>
              </tr>
            </Table>
          ))}
        </>
      </td>
    </tr>
  ))

  return (
    <Grid style={{ justifyContent: 'center' }}>
      <Grid.Col span={7}>
        <Paper shadow="xs" p="md">
          <Title order={5} ta="center" pb="3%">
            System Permissions
          </Title>
          <Table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Scopes</th>
              </tr>
            </thead>
            <tbody>
              {systemPermissions && systemPermissions?.length > 0 ? (
                systemPermissions
              ) : (
                <Text fz="sm" color="gray.6" ta="center">
                  No results
                </Text>
              )}
            </tbody>
          </Table>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper shadow="xs" p="md">
          <Title order={5} ta="center" pb="3%">
            Community Permissions
          </Title>
          <ScrollArea mah={400} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table>
              <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                <tr>
                  <th>Community ID</th>
                  <th>Scopes</th>
                </tr>
              </thead>
              <tbody>
                {communityPermissions && communityPermissions?.length > 0 ? (
                  communityPermissions
                ) : (
                  <Text fz="sm" color="gray.6" ta="center">
                    No results
                  </Text>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper shadow="xs" p="md">
          <Title order={5} ta="center" pb="3%">
            Resource Permissions
          </Title>
          <ScrollArea mah={400} onScrollPositionChange={({ y }) => setScrolledH1(y !== 0)}>
            <Table>
              <thead className={cx(classes.header, { [classes.scrolled]: scrolledH1 })}>
                <tr>
                  <th>Resource ID</th>
                  <th>Scopes</th>
                </tr>
              </thead>
              <tbody>
                {resourcePermissions && resourcePermissions?.length > 0 ? (
                  resourcePermissions
                ) : (
                  <Text fz="sm" color="gray.6" ta="center">
                    No results
                  </Text>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

export default Permissions
