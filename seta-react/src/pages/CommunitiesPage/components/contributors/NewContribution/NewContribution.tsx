import { ContextProvider } from '../StepperPage/context/Context'
import { MainContainer } from '../StepperPage/MainContainer'

const CreateContribution = () => {
  return (
    <>
      <ContextProvider>
        <MainContainer />
      </ContextProvider>
    </>
  )
}

export default CreateContribution
