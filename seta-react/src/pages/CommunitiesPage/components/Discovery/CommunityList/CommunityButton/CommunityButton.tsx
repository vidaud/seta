import { useEffect, useState } from 'react'
import { ActionIcon, Button, Group, createStyles } from '@mantine/core'
import { IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import { useMembershipID } from '../../../../../../api/communities/discover/community'
import MembershipRequest from '../../../Manage/Members/InviteMemberModal/InviteMemberModal'

const useStyles = createStyles({
  link: {
    color: 'black'
  }
})

const CommunityButton = props => {
  const { classes } = useStyles()
  const { data } = useMembershipID(props.community.community_id)
  const [row, setRow] = useState(data)

  useEffect(() => {
    if (data) {
      setRow(data)
    }
  }, [data, row])

  return (
    <>
      <Group>
        {data && data?.members?.length > 0 ? (
          <Group>
            <Link
              className={classes.link}
              to={`/communities/${props.community.community_id}`}
              replace={true}
            >
              <ActionIcon>
                <IconEye size="1rem" stroke={1.5} />
              </ActionIcon>
            </Link>

            <Button variant="filled" size="xs">
              + JOINED
            </Button>
          </Group>
        ) : (
          <Group>
            <ActionIcon>
              <IconEye size="1rem" stroke={1.5} />
            </ActionIcon>
            <MembershipRequest community_id={props.community.community_id} />
          </Group>
        )}
      </Group>
    </>
  )
}

export default CommunityButton
