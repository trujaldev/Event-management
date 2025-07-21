import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import Login from '@/components/shared/auth/Login'
import Signup from '@/components/shared/auth/Signup'
import Events from '@/components/shared/events/Events'
import Layout from '@/layouts/Layout'
import PrivateRoute from '@/routes/PrivateRoute'
import { availableRoutes } from '@/routes/routesConfig'

const router = createBrowserRouter([
  {
    path: availableRoutes.LOGIN,
    element: <Login />,
  },
  {
    path: availableRoutes.SIGN_UP,
    element: <Signup />,
  },
  {
    path: availableRoutes.HOME,
    element: <PrivateRoute component={Layout} />,
    children: [
      { index: true, element: <Navigate to={availableRoutes.EVENTS} /> },
      { path: availableRoutes.EVENTS, element: <Events /> },
    ],
  },
])

const RoutesProvider: React.FC = () => {
  return <RouterProvider router={router} />
}

export default RoutesProvider
