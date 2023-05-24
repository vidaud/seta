import React from 'react'
import { Box, Group, UnstyledButton, createStyles } from '@mantine/core'

import { StepperFive } from './StepperFive'
import { StepperFour } from './StepperFour'
import { StepperOne } from './StepperOne'
import { StepperThree } from './StepperThree'
import { StepperTwo } from './StepperTwo'

const useStyles = createStyles({
  container: {
    textAlign: 'left',
    justifyContent: 'left',
    marginTop: 220,

    '@media (min-width: 748px)': {
      justifyContent: 'center',
      paddingInline: 40,
      height: '100%',
      marginTop: 0,
      width: '67%'
    }
  },
  confirmButton: {
    backgroundColor: 'hsl(243, 100%, 62%)',
    fontWeight: 500,
    color: 'white',
    padding: 13,
    paddingInline: 15,
    borderRadius: 5,
    width: 'max-content',
    transition: '0.1s',

    '&:hover': {
      backgroundColor: 'hsl(243, 100%, 50%)'
    },
    '&:active': {
      transform: 'translateY(1px)'
    },

    '@media (min-width: 748px)': {
      fontSize: 15,
      padding: 13,
      paddingInline: 20,
      borderRadius: 7
    }
  },
  nextButton: {
    backgroundColor: 'hsl(213, 96%, 18%)',
    fontWeight: 500,
    color: 'white',
    padding: 13,
    paddingInline: 15,
    borderRadius: 5,
    width: 'max-content',
    transition: '0.1s',

    '&:hover': {
      backgroundColor: 'hsl(213, 96%, 18%, 0.9)'
    },
    '&:active': {
      transform: 'translateY(1px)'
    },

    '@media (min-width: 748px)': {
      fontSize: 15,
      padding: 13,
      paddingInline: 20,
      borderRadius: 7
    }
  },
  backButton: {
    fontWeight: 500,
    color: 'hsl(213, 96%, 18%, 0.5)',
    padding: 13,
    paddingInline: 15,
    borderRadius: 5,
    width: 'max-content',
    transition: '0.1s',

    '&:hover': {
      backgroundColor: 'hsl(213, 96%, 18%, 0.05)'
    },
    '&:active': {
      transform: 'translateY(1px)'
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },

    '@media (min-width: 748px)': {
      fontSize: 15,
      padding: 13,
      paddingInline: 20,
      borderRadius: 7
    }
  }
})

export const StepperContent = ({ active, nextStep, prevStep }) => {
  const { classes } = useStyles()

  return (
    <>
      <Group className={classes.container}>
        <Box>
          {active === 0 ? (
            <StepperOne />
          ) : active === 1 ? (
            <StepperTwo />
          ) : active === 2 ? (
            <StepperThree />
          ) : active === 3 ? (
            <StepperFour />
          ) : (
            <StepperFive />
          )}
          {/** next / prev step button */}
          <Box
            sx={{
              display: active >= 4 ? 'none' : 'flex',
              justifyContent: active === 0 ? 'end' : 'space-between',
              paddingTop: '3%'
            }}
          >
            <UnstyledButton
              onClick={prevStep}
              disabled={active === 0}
              className={classes.backButton}
            >
              Go Back
            </UnstyledButton>
            {active === 3 ? (
              <UnstyledButton onClick={nextStep} className={classes.confirmButton}>
                Confirm
              </UnstyledButton>
            ) : (
              <UnstyledButton onClick={nextStep} className={classes.nextButton}>
                Next step
              </UnstyledButton>
            )}
          </Box>
        </Box>
      </Group>
    </>
  )
}
