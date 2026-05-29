import { Navigate, Outlet } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'

export function RequireSubscriptionLayout() {
  const { hasAccess, loading } = useSubscription()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  if (!hasAccess) return <Navigate to="/billing" replace />

  return <Outlet />
}
