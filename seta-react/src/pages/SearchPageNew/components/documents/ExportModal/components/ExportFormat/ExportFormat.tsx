import { Select, Stack } from '@mantine/core'

import InfoTitle from '~/components/InfoTitle'

import type { ExportFormatKey, ExportSelectItem } from '~/types/library/library-export'

type Props = {
  data: ExportSelectItem[]
  value: ExportFormatKey
  onChange: (value: ExportFormatKey) => void
}

const ExportFormat = ({ data, value, onChange }: Props) => {
  const tooltipLabel = (
    <Stack spacing="xs">
      <div>Select the format for the exported data.</div>

      <div>CSV is a simple text format that can be opened in any spreadsheet application.</div>

      <div>
        JSON is a structured format that can be used to import data into other applications.
      </div>
    </Stack>
  )

  return (
    <Stack spacing="xs" align="center">
      <InfoTitle
        tooltip={tooltipLabel}
        tooltipOptions={{ width: 400, multiline: true, withinPortal: true }}
      >
        Export format
      </InfoTitle>

      <Select data={data} value={value} onChange={onChange} />
    </Stack>
  )
}

export default ExportFormat
