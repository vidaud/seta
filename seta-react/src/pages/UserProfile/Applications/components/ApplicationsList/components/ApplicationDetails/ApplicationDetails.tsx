import { useState } from 'react'
import { Collapse, Tabs } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'

import ApplicationRSAKeys from './components/ApplicationRSAKey/ApplicationRSAKey'

type Props = ClassNameProp & {
  open: boolean
  appName: string
}

const ApplicationDetails = ({ className, open, appName }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>('rsa-keys')

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
              <Tabs.Tab value="rsa-keys">RSA Public Keys</Tabs.Tab>
            </Tabs.List>

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
