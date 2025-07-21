import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { ToastContainer } from 'react-toastify'

import AuthProvider from '@/contexts/AuthProvider'
import RoutesProvider from '@/routes/Routes'

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <RoutesProvider />
        <ToastContainer
          position="top-center"
          hideProgressBar
          theme="colored"
          autoClose={3000}
          toastClassName="min-w-[30rem]"
        />
      </AuthProvider>
    </MantineProvider>
  )
}

export default App
