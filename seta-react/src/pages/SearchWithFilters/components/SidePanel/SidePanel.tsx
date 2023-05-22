import { Accordion, Container, Alert, rem } from '@mantine/core'
import { IconListSearch, IconSearch, IconAlertCircle, IconWallet } from '@tabler/icons-react'

import type { AdvancedFilterProps } from '../../types/contracts'
import FiltersPanel from '../FiltersPanel'

const SidePanel = ({ queryContract, onApplyFilter, filtersDisabled }: AdvancedFilterProps) => {
  const defaultValue: string | undefined = filtersDisabled ? undefined : 'filters'

  return (
    <Container size={rem(400)} ml={0} pt={rem(50)} pb={rem(50)}>
      <Accordion defaultValue={defaultValue} variant="contained" order={3}>
        <Accordion.Item value="filters">
          <Accordion.Control icon={<IconListSearch size={rem(20)} />} disabled={filtersDisabled}>
            Filter
          </Accordion.Control>
          <Accordion.Panel>
            <FiltersPanel queryContract={queryContract} onApplyFilter={onApplyFilter} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="search">
          <Accordion.Control icon={<IconSearch size={rem(20)} />}>My Search</Accordion.Control>
          <Accordion.Panel>
            <Alert icon={<IconAlertCircle size="1rem" />} title="Not implemented yet!" color="red">
              This panel will contain my search libray.
            </Alert>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="wallet">
          <Accordion.Control icon={<IconWallet size={rem(20)} />}>My Documents</Accordion.Control>
          <Accordion.Panel>
            <Alert icon={<IconAlertCircle size="1rem" />} title="Not implemented yet!" color="red">
              This panel will contain my document library.
            </Alert>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}

export default SidePanel
