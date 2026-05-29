import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Dashboard } from './pages/Dashboard'
import { ChallengePage } from './pages/ChallengePage'
import { ProfilePage } from './pages/ProfilePage'
import { BillingPage } from './pages/BillingPage'
import { BillingSuccessPage } from './pages/BillingSuccessPage'
import { RequireAuthLayout } from './components/RequireAuthLayout'
import { RequireSubscriptionLayout } from './components/RequireSubscriptionLayout'

const router = createBrowserRouter([
  {
    element: <RequireAuthLayout />,
    children: [
      // Billing is accessible after sign-in but before (and without) a subscription.
      { path: '/billing',         element: <BillingPage /> },
      { path: '/billing/success', element: <BillingSuccessPage /> },

      // Everything else requires an active/trialing subscription.
      {
        element: <RequireSubscriptionLayout />,
        children: [
          { path: '/',                  element: <Dashboard /> },
          { path: '/challenge/:id',     element: <ChallengePage /> },
          { path: '/profile',           element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-700 mb-4">404</p>
          <p className="mb-6">Page not found.</p>
          <a href="/" className="text-cyan-400 hover:underline">Back to Dashboard</a>
        </div>
      </div>
    ),
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
