import * as React from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AdminLayout from './layouts/AdminLayout'
import { AppContext } from './contexts/app.context'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import Users from './pages/Users'
import Comment from './pages/Comment'
import Contact from './pages/Contact'

function ProtecedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='login' />
}
function RejectedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
  const { profile } = React.useContext(AppContext)
  const isAdmin = profile?.isAdmin

  const getAdminRoutes = () => {
    if (!isAdmin) {
      return []
    }

    return [
      {
        path: '/user',
        element: (
          <AdminLayout>
            <Users />
          </AdminLayout>
        )
      }
    ]
  }

  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: '/',
          index: true,
          element: (
            <AdminLayout>
              <div>kk</div>
            </AdminLayout>
          )
        },
        {
          path: '/comment',
          element: (
            <AdminLayout>
              <Contact />
            </AdminLayout>
          )
        },
        {
          path: '/contact',
          element: (
            <AdminLayout>
              <Comment />
            </AdminLayout>
          )
        },
        // Spread to include all routes returned by getAdminRoutes
        ...getAdminRoutes()
      ]
    }
  ])

  return routeElements
}
export default useRouteElements
