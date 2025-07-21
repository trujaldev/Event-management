import React from 'react'
import { Navigate } from 'react-router-dom'

import useAuthContext from '@/hooks/use-auth-context'
import { availableRoutes } from '@/routes/routesConfig'

interface PrivateRouteProps {
  component: React.FC
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component }) => {
  const Component = component
  const { user, logout } = useAuthContext()

  if (!user) {
    logout()
    return <Navigate to={availableRoutes.LOGIN} />
  }

  return <Component />
}

export default PrivateRoute
