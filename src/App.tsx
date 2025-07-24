import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import 'mantine-datatable/styles.css'
import { ToastContainer } from 'react-toastify'

import AuthProvider from '@/contexts/AuthProvider'
import EventsProvider from '@/contexts/EventsProvider'
import RoutesProvider from '@/routes/Routes'

function App() {
  return (
    <MantineProvider>
      <EventsProvider>
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
      </EventsProvider>
    </MantineProvider>
  )
}

export default App
