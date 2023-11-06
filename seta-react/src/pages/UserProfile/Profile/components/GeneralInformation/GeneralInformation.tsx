import { Anchor, Badge, Paper, Table, Title, createStyles } from '@mantine/core'

const useStyles = createStyles(() => ({
  td: {
    fontWeight: 'bold'
  },
  value: {
    wordBreak: 'break-word'
  }
}))

export enum UserRole {
  User = 'user',
  Administrator = 'Administrator'
}

const GeneralInformation = ({ details }) => {
  const { classes } = useStyles()
  const user = details?.external_providers?.filter(item => item.is_current_auth === true)[0]
  const color = details?.role === UserRole.Administrator ? 'orange.4' : 'cyan.3'

  return (
    <Paper shadow="xs" p="md">
      <Title order={5} ta="center" pb="3%">
        General Information
      </Title>
      <Table verticalSpacing="sm">
        <tbody>
          <tr>
            <td className={classes.td}>Role</td>
            <td>
              <Badge color={color}>{details?.role}</Badge>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>Email</td>

            <td className={classes.value}>
              <Anchor component="button" size="sm">
                {details?.email}
              </Anchor>
            </td>
          </tr>
          <tr>
            <td className={classes.td}>User Identifier</td>
            <td className={classes.value}>{details?.username}</td>
          </tr>
          <tr>
            <td className={classes.td}>First Name</td>
            <td className={classes.value}>{user?.firstName}</td>
          </tr>
          <tr>
            <td className={classes.td}>Last Name</td>
            <td className={classes.value}>{user?.lastName}</td>
          </tr>
        </tbody>
      </Table>
    </Paper>
  )
}

export default GeneralInformation
