import { Button, Stack, Tooltip, Text } from '@mantine/core'
import { modals } from '@mantine/modals'

import { AccountStatus } from '~/types/admin/user-info'

type Props = {
  status?: AccountStatus
  onDeleteAccount?(): void
  onChangeAccountStatus?(status: AccountStatus): void
}

const Actions = ({ status, onDeleteAccount, onChangeAccountStatus }: Props) => {
  const handleDeleteAccount = () =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">The account deletion is not reversible. Please confirm!</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => onDeleteAccount?.()
    })

  const handleDisableAccount = () => {
    onChangeAccountStatus?.(AccountStatus.Disabled)
  }

  const handleActivateAccount = () => {
    onChangeAccountStatus?.(AccountStatus.Active)
  }

  return (
    <Stack>
      {status === AccountStatus.Active && (
        <Tooltip
          label="Disable authentication for this account."
          multiline
          withArrow
          width={220}
          openDelay={300}
        >
          <Button variant="subtle" color="orange.4" onClick={handleDisableAccount}>
            Disable account
          </Button>
        </Tooltip>
      )}

      {status === AccountStatus.Disabled && (
        <Tooltip
          label="Enable authentication for this account."
          multiline
          withArrow
          width={220}
          openDelay={300}
        >
          <Button variant="outline" color="blue" onClick={handleActivateAccount}>
            Enable account
          </Button>
        </Tooltip>
      )}

      {status === AccountStatus.Blocked && (
        <Tooltip label="Unblock this account." multiline withArrow width={220} openDelay={300}>
          <Button variant="outline" color="blue" onClick={handleActivateAccount}>
            Unblock account
          </Button>
        </Tooltip>
      )}

      <Tooltip
        label="Delete this account and discard all personal information. This action is not reversible and a confirmation dialog will appear!"
        multiline
        withArrow
        width={220}
        openDelay={300}
        position="bottom"
      >
        <Button color="red.3" variant="subtle" onClick={handleDeleteAccount}>
          Delete account
        </Button>
      </Tooltip>
    </Stack>
  )
}

export default Actions
