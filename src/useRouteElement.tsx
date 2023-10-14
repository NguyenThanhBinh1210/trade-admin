import * as React from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AdminLayout from './layouts/AdminLayout'
import { AppContext } from './contexts/app.context'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import Comment from './pages/Comment'
import Contact from './pages/Contact'
import Users from './pages/Users'

function ProtecedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='login' />
}
function RejectedRoute() {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
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
              <Comment />
            </AdminLayout>
          )
        },
        {
          path: '/contact',
          element: (
            <AdminLayout>
              <Contact />
            </AdminLayout>
          )
        },
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
  ])

  return routeElements
}
export default useRouteElements
