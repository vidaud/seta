import { Radio, Group } from '@mantine/core'

import { UserRole } from '~/types/user'

type Props = {
  role: UserRole
  onRoleChange?(value: string): void
}

const RoleEditor = ({ role, onRoleChange }: Props) => {
  const val: string = role

  return (
    <Radio.Group
      value={val}
      onChange={onRoleChange}
      name="role"
      label="Select the role for this account:"
      p={10}
    >
      <Group mt="xs">
        <Radio value={UserRole.User} label="User" description="Regular user" />
        <Radio
          value={UserRole.Administrator}
          color="orange"
          label="Administrator"
          description="Grant SysAdmin privileges"
        />
      </Group>
    </Radio.Group>
  )
}

export default RoleEditor
