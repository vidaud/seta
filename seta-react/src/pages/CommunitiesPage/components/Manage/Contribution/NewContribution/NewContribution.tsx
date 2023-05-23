import { MantineProvider } from '@mantine/core'

import { ContextProvider } from '../StepperPage/context/Context'
import { MainContainer } from '../StepperPage/MainContainer'

const CreateContribution = () => {
  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light'
        }}
      >
        <ContextProvider>
          <div className="page">
            <MainContainer />
          </div>
        </ContextProvider>
      </MantineProvider>
    </>
  )
}

export default CreateContribution
