import { useState } from 'react'
import { Collapse, Tabs } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import ApplicationsPermissions from './components/ApplicationPermissions/ApplicationPermissions'
import ApplicationRSAKeys from './components/ApplicationRSAKey/ApplicationRSAKey'

type Props = ClassNameProp & {
  open: boolean
  appName: string
}

const ApplicationDetails = ({ className, open, appName }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('permissions')

  return (
    <tr style={open ? { backgroundColor: 'white' } : { display: 'none' }}>
      <td colSpan={6}>
        <Collapse className={className} in={open}>
          <Tabs value={activeTab} onTabChange={setActiveTab} orientation="horizontal" p="1rem">
            <Tabs.List
              sx={theme => ({
                marginBottom: theme.spacing.xs
              })}
            >
              <Tabs.Tab value="permissions">Permissions</Tabs.Tab>

              <Tabs.Tab value="rsa-keys">RSA Public Keys</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="permissions">
              {open ? <ApplicationsPermissions appName={appName} /> : null}
            </Tabs.Panel>
            <Tabs.Panel value="rsa-keys">
              {open ? <ApplicationRSAKeys appName={appName} /> : null}
            </Tabs.Panel>
          </Tabs>
        </Collapse>
      </td>
    </tr>
  )
}

export default ApplicationDetails
