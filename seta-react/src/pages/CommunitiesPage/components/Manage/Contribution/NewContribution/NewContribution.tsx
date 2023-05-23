import { useState } from 'react'
import { Button, Group, Stepper, Container } from '@mantine/core'
import { IconFileImport, IconClipboardData, IconNetwork, IconChecklist } from '@tabler/icons-react'

import FileUploadStep from '../FileUploadStep/FileUploadStep'
import MetadataStep from '../MetadataStep/MetadataStep'

const CreateContribution = () => {
  const [active, setActive] = useState(1)
  const nextStep = () => setActive(current => (current < 4 ? current + 1 : current))
  const prevStep = () => setActive(current => (current > 0 ? current - 1 : current))

  return (
    <div className="page">
      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
        <Stepper.Step
          icon={<IconFileImport size="1.1rem" />}
          label="Step 1"
          description="File Upload"
          completedIcon={<IconFileImport />}
        >
          <Container>
            <FileUploadStep />
          </Container>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconClipboardData size="1.1rem" />}
          label="Step 2"
          description="Metadata"
          completedIcon={<IconClipboardData />}
        >
          <Container>
            <MetadataStep />
          </Container>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconNetwork size="1.1rem" />}
          label="Step 3"
          description="Taxonomy"
          completedIcon={<IconNetwork />}
        >
          <Container>Step 3 content: Taxonomy</Container>
        </Stepper.Step>
        <Stepper.Step
          icon={<IconChecklist size="1.1rem" />}
          label="Step 4"
          description="Review"
          completedIcon={<IconChecklist />}
        >
          <Container>Step 3 content: Review Contribution</Container>
        </Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        {active !== 0 ? (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        ) : (
          ''
        )}
        {active !== 4 ? <Button onClick={nextStep}>Next step</Button> : ''}
      </Group>
    </div>
  )
}

export default CreateContribution
