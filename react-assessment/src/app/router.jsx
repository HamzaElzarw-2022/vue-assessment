import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import LoginView from '@/views/LoginView'
import DashboardView from '@/views/DashboardView'
import PostsView from '@/views/PostsView'
import UsersView from '@/views/UsersView'
import CommentsView from '@/views/CommentsView'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <DashboardView />,
          },
          {
            path: 'posts',
            element: <PostsView />,
          },
          {
            path: 'users',
            element: <UsersView />,
          },
          {
            path: 'comments',
            element: <CommentsView />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
