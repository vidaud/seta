import { useState } from 'react'
import { Collapse, Tabs } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import ApplicationAuthKey from './components/ApplicationsAuthKey/ApplicationsAuthKey'

type Props = ClassNameProp & {
  open: boolean
  appName: string
}

const ApplicationDetails = ({ className, open, appName }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('auth-key')

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
              <Tabs.Tab value="auth-key">Authentication Key</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="auth-key">
              {open ? <ApplicationAuthKey appName={appName} /> : null}
            </Tabs.Panel>
          </Tabs>
        </Collapse>
      </td>
    </tr>
  )
}

export default ApplicationDetails
