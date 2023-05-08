import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClientOptions } from '~/config/query-client-config'

import AppRouter from './components/AppRouter'
import { emotionCache, theme } from './styles'

const App = () => {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={emotionCache} theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
