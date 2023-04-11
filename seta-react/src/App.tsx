import { MantineProvider } from '@mantine/core'

import AppRouter from './components/AppRouter'
import { emotionCache, theme } from './styles'

const App = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={emotionCache} theme={theme}>
      <AppRouter />
    </MantineProvider>
  )
}

export default App
