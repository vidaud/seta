import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import AppRouter from './components/AppRouter'

const App = () => {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://unpkg.com/primeflex@3.2.1/primeflex.min.css" />

      <AppRouter />
    </div>
  )
}

export default App
