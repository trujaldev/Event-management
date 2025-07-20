import React from 'react'
import { Navigate } from 'react-router-dom'

import { availableRoutes } from '@/routes/routesConfig'

interface PrivateRouteProps {
  component: React.FC
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component }) => {
  const Component = component

  if (true) {
    return <Navigate to={availableRoutes.LOGIN} />
  }

  return <Component />
}

export default PrivateRoute
