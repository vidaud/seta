import { useEffect, useState } from 'react'
import { createStyles, Table, rem, Text } from '@mantine/core'

import {
  ComponentEmpty,
  ComponentError,
  ComponentLoading
} from '~/pages/CommunitiesPage/components/common'

import { useInviteID } from '~/api/communities/invite'
import useModalState from '~/hooks/use-modal-state'

import MessageModal from '../MessageModal/MessageModal'

const useStyles = createStyles(theme => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`
    }
  },

  scrolled: {
    boxShadow: theme.shadows.sm
  },
  title: {
    paddingBottom: theme.spacing.xl
  },
  td: {
    whiteSpace: 'nowrap',
    maxWidth: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      cursor: 'pointer'
    }
  }
}))

const CommunityInvites = ({ id, type }) => {
  const { modalOpen, openModal, closeModal } = useModalState()
  const { classes, cx } = useStyles()
  const perPage = 5
  const { data, isLoading, error, refetch } = useInviteID(id)
  const [items, setItems] = useState(type === 'container' ? data?.slice(0, perPage) : data)

  useEffect(() => {
    let timeout: number | null = null

    if (data) {
      type === 'container' ? setItems(data.slice(0, perPage)) : setItems(data)
    }

    timeout = setTimeout(refetch, 1000)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [data, refetch, type])

  if (error) {
    return <ComponentError onTryAgain={refetch} />
  }

  if (data) {
    if (data.length === 0) {
      return <ComponentEmpty />
    }
  }

  if (isLoading || !data) {
    return <ComponentLoading />
  }

  const rows = items?.map(row => (
    <tr key={row.invite_id}>
      <td>{row.community_id.charAt(0).toUpperCase() + row?.community_id.slice(1)}</td>
      <td>{row.invited_user_info.full_name}</td>
      <td className={classes.td}>
        <span onClick={openModal}>
          {row.message.charAt(0).toUpperCase() + row.message.slice(1)}
        </span>
        <MessageModal
          title=" Expand Message"
          message={row.message.charAt(0).toUpperCase() + row.message.slice(1)}
          opened={modalOpen}
          onClose={closeModal}
        />
      </td>
      <td>{row.status.toUpperCase()}</td>
      <td>{new Date(row.initiated_date).toLocaleDateString()}</td>
      <td>{row.initiated_by_info.full_name}</td>
      {/* <td>
        <Group spacing={0}>
          <UpdateInviteRequest props={row} parent="InvitesList" />
        </Group>
      </td> */}
    </tr>
  ))

  return (
    <>
      <Table miw={500}>
        <thead className={cx(classes.header)}>
          <tr>
            <th>Community</th>
            <th>Invited User</th>
            <th>Message</th>
            <th>Status</th>
            <th>Initiated Date</th>
            <th>Initiated By</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {data.length > perPage && type === 'container' ? (
        <Text color="gray.5" size="sm" sx={{ float: 'right' }}>
          Expand to see full list ...
        </Text>
      ) : null}
    </>
  )
}

export default CommunityInvites
