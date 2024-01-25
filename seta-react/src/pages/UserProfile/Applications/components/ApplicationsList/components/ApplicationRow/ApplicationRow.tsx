import { Badge, Group, clsx, createStyles, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaChevronDown } from 'react-icons/fa'

import type { ApplicationModel } from '~/api/types/applications-permissions-types'

import * as S from './styles'

import ApplicationDetails from '../ApplicationDetails'
import DeleteApplication from '../DeleteApplication'
import UpdateApplication from '../UpdateApplication'

type Props = {
  props: ApplicationModel
}

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

const ApplicationsRow = ({ props }: Props) => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [detailsOpen, { toggle }] = useDisclosure()
  const chevronClass = clsx({ open: detailsOpen })

  const toggleIcon = (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  return (
    <>
      <tr onClick={toggle}>
        <td>{toggleIcon}</td>
        <td>{props.provider}</td>
        <td>{props.name}</td>
        <td className={classes.td}>{props.description}</td>
        <td>
          <Badge
            size="md"
            color={statusColors[props?.status.toLowerCase()]}
            variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
          >
            {props?.status.toUpperCase()}
          </Badge>
        </td>
        <td>
          <Group>
            <UpdateApplication application={props} />
            <DeleteApplication application={props} />
          </Group>
        </td>
      </tr>

      <ApplicationDetails css={S.details} open={detailsOpen} appName={props.name} />
    </>
  )
}

export default ApplicationsRow
