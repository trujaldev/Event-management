import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ToastContainer } from 'react-toastify'

import RoutesProvider from '@/routes/Routes'

function App() {
  return (
    <MantineProvider>
      <RoutesProvider />
      <ToastContainer
        position="top-center"
        hideProgressBar
        theme="colored"
        autoClose={3000}
        toastClassName="min-w-[30rem]"
      />
    </MantineProvider>
  )
}

export default App
