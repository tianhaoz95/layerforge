import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SignInPage } from '../pages/SignInPage'

export function RequireAuthLayout() {
  const { user, loading, signIn } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <SignInPage onSignIn={() => void signIn()} />
  }

  return <Outlet />
}
