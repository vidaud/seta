import { Text, createStyles, Paper, Table, Title } from '@mantine/core'
import { BsCheckCircle } from 'react-icons/bs'

const useStyles = createStyles(() => ({
  td: {
    wordBreak: 'break-word'
  },
  th: {
    [`@media only screen and (min-width: 520px) and (max-width: 712px) and (orientation: portrait)`]:
      {
        padding: '0.75rem 0.225rem !important'
      }
  }
}))

const ExternalProviders = ({ details }) => {
  const { classes } = useStyles()
  const providers = details?.external_providers?.map((element, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <tr key={index}>
      <td className={classes.td}>
        {element.is_current_auth === true ? (
          <BsCheckCircle color="teal" stroke="1.5" size={20} />
        ) : null}
      </td>
      <td className={classes.td}>{element?.provider_uid}</td>
      <td className={classes.td}>
        <Text tt="uppercase">{element?.provider}</Text>
      </td>
      <td className={classes.td}>{element?.domain}</td>
    </tr>
  ))

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={5} ta="center" pb="3%">
        External Providers
      </Title>
      <Table verticalSpacing="sm" striped>
        <thead>
          <tr>
            <th />
            <th className={classes.th}>Identifier</th>
            <th className={classes.th}>Provider</th>
            <th className={classes.th}>Domain</th>
          </tr>
        </thead>
        <tbody>{providers}</tbody>
      </Table>
    </Paper>
  )
}

export default ExternalProviders
