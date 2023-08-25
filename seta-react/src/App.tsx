import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClientOptions } from '~/config/query-client-config'
import { UserProvider } from '~/contexts/user-context'

import AppRouter from './components/AppRouter'
import { emotionCache, theme } from './styles'

const App = () => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={emotionCache} theme={theme}>
      <Notifications position="top-right" zIndex={2077} />

      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <AppRouter />
          </UserProvider>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
