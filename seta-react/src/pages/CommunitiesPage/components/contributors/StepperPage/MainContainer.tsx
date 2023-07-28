import React, { useState } from 'react'
import { Box, createStyles } from '@mantine/core'

import { StepperContent } from './StepperContent'
import { StepperStep } from './StepperStep'

const useStyles = createStyles({
  box: {
    width: '100%'
  },
  stepper: {
    textAlign: 'left',
    marginBottom: '2%'
  }
})

export const MainContainer = () => {
  const { classes } = useStyles()
  const [active, setActive] = useState(0)

  const nextStep = () => setActive(active => (active < 4 ? active + 1 : active))
  const prevStep = () => setActive(active => (active > 0 ? active - 1 : active))

  return (
    <>
      <Box className={classes.box}>
        {/** stepper step */}
        <Box className={classes.stepper}>
          <StepperStep active={active} setActive={setActive} />
        </Box>

        {/** stepper content */}
        <StepperContent active={active} nextStep={nextStep} prevStep={prevStep} />
      </Box>
    </>
  )
}
