import React from 'react'
import { MantineProvider } from '@mantine/core'

import { ContextProvider } from '../context/Context'
import { MainContainer } from '../MainContainer'

export const Main = () => {
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
