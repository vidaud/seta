import { ContextProvider } from '../StepperPage/context/Context'
import { MainContainer } from '../StepperPage/MainContainer'

const CreateContribution = () => {
  return (
    <>
      <ContextProvider>
        <div className="page">
          <MainContainer />
        </div>
      </ContextProvider>
    </>
  )
}

export default CreateContribution
