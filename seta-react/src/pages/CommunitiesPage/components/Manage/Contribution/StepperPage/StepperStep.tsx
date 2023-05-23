import React from 'react'
import { Stepper } from '@mantine/core'
import { IconChecklist, IconClipboardData, IconFileImport, IconNetwork } from '@tabler/icons-react'

export const StepperStep = ({ active, setActive }) => {
  return (
    <>
      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step
          icon={<IconFileImport size="1.1rem" />}
          label="Step 1"
          description="File Upload"
          completedIcon={<IconFileImport />}
        />
        <Stepper.Step
          icon={<IconClipboardData size="1.1rem" />}
          label="Step 2"
          description="Metadata"
          completedIcon={<IconClipboardData />}
        />
        <Stepper.Step
          icon={<IconNetwork size="1.1rem" />}
          label="Step 3"
          description="Taxonomy"
          completedIcon={<IconNetwork />}
        />
        <Stepper.Step
          icon={<IconChecklist size="1.1rem" />}
          label="Step 4"
          description="Review"
          completedIcon={<IconChecklist />}
        />
      </Stepper>
    </>
  )
}
