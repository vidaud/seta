import { Paper, Table, Title, createStyles } from '@mantine/core'

const useStyles = createStyles(() => ({
  td: {
    fontWeight: 'bold'
  }
}))

const GeneralInformation = ({ details }) => {
  const { classes } = useStyles()

  return (
    <Paper shadow="xs" p="md">
      <Title order={5} ta="center">
        General Information
      </Title>
      <Table verticalSpacing="sm">
        <tbody>
          <tr>
            <td className={classes.td}>Email</td>
            <td>{details?.email}</td>
          </tr>
          <tr>
            <td className={classes.td}>User Identifier</td>
            <td>{details?.username}</td>
          </tr>
          <tr>
            <td className={classes.td}>First Name</td>
            <td>{details?.firstName}</td>
          </tr>
          <tr>
            <td className={classes.td}>Last Name</td>
            <td>{details?.lastName}</td>
          </tr>
        </tbody>
      </Table>
    </Paper>
  )
}

export default GeneralInformation
