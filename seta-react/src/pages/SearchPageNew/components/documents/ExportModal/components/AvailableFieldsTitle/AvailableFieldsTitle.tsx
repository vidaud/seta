import { IconArrowBigLeftLine, IconArrowBigRightLine } from '@tabler/icons-react'

import ActionLink from '~/components/ActionLink'

import SelectSectionTitle from '../SelectSectionTitle'

type Props = {
  areFieldsSelected: boolean
  loading?: boolean
  onSelectAllNone: () => void
}

const AvailableFieldsTitle = ({ areFieldsSelected, loading, onSelectAllNone }: Props) => {
  const tooltip = loading ? undefined : 'Select the fields to include for each exported document'

  const action = !loading && (
    <ActionLink
      leftIcon={areFieldsSelected ? <IconArrowBigLeftLine /> : <IconArrowBigRightLine />}
      onClick={onSelectAllNone}
    >
      Select {areFieldsSelected ? 'none' : 'all'}
    </ActionLink>
  )

  return (
    <SelectSectionTitle title="Available fields" tooltip={tooltip}>
      {action}
    </SelectSectionTitle>
  )
}

export default AvailableFieldsTitle
