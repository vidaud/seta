import { Button, Tooltip, clsx } from '@mantine/core'
import { GiSaveArrow } from 'react-icons/gi'

import type { StagedDocument } from '~/pages/SearchPageNew/types/search'

import useMinValue from '~/hooks/use-min-value'
import type { ClassAndStyleProps } from '~/types/children-props'
import { pluralize } from '~/utils/string-utils'

type Props = {
  docs: StagedDocument[]
  onClick?: () => void
} & ClassAndStyleProps

const StagedDocsInfo = ({ className, style, docs, onClick }: Props) => {
  const count = useMinValue(docs.length, 1)

  const label = `${count} ${pluralize('document', count)} staged`

  const classes = clsx(className, 'seta-StagedDocsInfo-root')

  return (
    <div className={classes} style={style}>
      <Tooltip label={label}>
        <Button
          variant="outline"
          color="blue"
          size="xs"
          fz="sm"
          leftIcon={<GiSaveArrow size={19} />}
          onClick={onClick}
        >
          {count}
        </Button>
      </Tooltip>
    </div>
  )
}

export default StagedDocsInfo
