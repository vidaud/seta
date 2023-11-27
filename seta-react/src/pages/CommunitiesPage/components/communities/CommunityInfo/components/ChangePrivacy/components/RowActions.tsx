import { useState } from 'react'
import {
  Group,
  Switch,
  UnstyledButton,
  useMantineTheme,
  Popover,
  createStyles,
  Textarea,
  Button
} from '@mantine/core'
import { FaUsers, FaUsersSlash } from 'react-icons/fa'

import type { MembershipRequestValues } from '~/pages/CommunitiesPage/contexts/membership-request-context'
import {
  MembershipRequestFormProvider,
  useMembershipRequest
} from '~/pages/CommunitiesPage/contexts/membership-request-context'

import { useCommunityChangeRequests } from '~/api/communities/communities/community-change-requests'
import type { CommunityResponse } from '~/api/types/community-types'

type Props = {
  onApprove(value: string): void
  onReject(value: string): void
  community: CommunityResponse
}

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

const RowActions = ({ onApprove, onReject, community }: Props) => {
  const activeLink = community.membership
  const { classes, cx } = useStyles()
  const [checked, setChecked] = useState(community.membership === 'opened')
  const [opened, setOpened] = useState(false)

  const theme = useMantineTheme()
  const { data } = useCommunityChangeRequests(community.community_id)
  const [nrChangeRequests] = useState(
    data?.community_change_requests.filter(
      item => item.status === 'pending' && item.field_name === 'membership'
    ).length
  )
  const form = useMembershipRequest({
    initialValues: {
      message: community.membership
    },
    validate: values => ({
      message: values.message.length < 20 ? 'message must have at least 20 letters' : null
    })
  })

  const handleSubmit = (value: MembershipRequestValues) => {
    if (activeLink !== 'opened') {
      onApprove(value.message)
    } else {
      onReject(value.message)
    }
  }

  return (
    <>
      <Popover
        width={300}
        position="left"
        withArrow
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Group>
            <UnstyledButton
              className={classes.button}
              onClick={e => {
                e.stopPropagation()
                setOpened(o => !o)
              }}
            >
              <FaUsers size="1rem" stroke="1.5" /> Membership Change Request
            </UnstyledButton>
          </Group>
        </Popover.Target>
        <Popover.Dropdown
          sx={() => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
          })}
        >
          <MembershipRequestFormProvider form={form}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Group noWrap>
                {nrChangeRequests === 0 ? (
                  <Switch
                    checked={checked}
                    onChange={event => {
                      setChecked(event.currentTarget.checked)
                    }}
                    color="teal"
                    size="md"
                    label={activeLink === 'closed' ? 'Restricted Community' : 'Opened Community'}
                    thumbIcon={
                      checked ? (
                        <FaUsers
                          size="0.8rem"
                          color={theme.colors.teal[theme.fn.primaryShade()]}
                          stroke="3"
                        />
                      ) : (
                        <FaUsersSlash
                          size="0.8rem"
                          color={theme.colors.orange[theme.fn.primaryShade()]}
                          stroke="3"
                        />
                      )
                    }
                  />
                ) : (
                  <Switch
                    checked={community.membership !== 'opened'}
                    disabled={true}
                    color="teal"
                    size="md"
                    label="Request Pending"
                    thumbIcon={
                      checked ? (
                        <FaUsers
                          size="0.8rem"
                          color={theme.colors.gray[theme.fn.primaryShade()]}
                          stroke="3"
                        />
                      ) : (
                        <FaUsersSlash
                          size="0.8rem"
                          color={theme.colors.gray[theme.fn.primaryShade()]}
                          stroke="3"
                        />
                      )
                    }
                  />
                )}
              </Group>
              <Textarea
                pt="xs"
                label="Message"
                disabled={nrChangeRequests === 0 ? false : true}
                placeholder="Please enter a justification for your request"
                {...form.getInputProps('message')}
                withAsterisk
              />
              {nrChangeRequests === 0 ? (
                <Group className={cx(classes.form)}>
                  <Button
                    variant="outline"
                    size="xs"
                    color="blue"
                    onClick={e => {
                      form.reset()
                      setOpened(o => !o)
                      e.stopPropagation()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
                    Send Request
                  </Button>
                </Group>
              ) : null}
            </form>
          </MembershipRequestFormProvider>
        </Popover.Dropdown>
      </Popover>
    </>
  )
}

export default RowActions
