import { Text } from '@mantine/core'

import type { ClassNameProp } from '~/types/children-props'
import type { ExportField } from '~/types/library/library-export'

type Props = ClassNameProp & {
  field: ExportField
}

const FieldInfo = ({ field: { name, description }, className }: Props) => {
  return (
    <div className={className}>
      <Text size="md" mb={0}>
        {name}
      </Text>

      <Text size="sm" color="dimmed">
        {description}
      </Text>
    </div>
  )
}

export default FieldInfo
