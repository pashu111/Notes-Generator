import { Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Auth from "./pages/Auth.jsx"
import History from "./pages/History.jsx"
import Notes from "./pages/Notes.jsx"
import Pricing from "./pages/Pricing.jsx"
import { useEffect } from 'react'
import { getCurrentUser } from './services/api.js'
import {useDispatch, useSelector} from 'react-redux'

function App () {
  const dispatch = useDispatch()
  useEffect(()=>{
    getCurrentUser(dispatch)
  },[dispatch])

  const {userData, isLoading} = useSelector((state)=>state.user)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const guard = (el) => (userData ? el : <Navigate to="/auth" replace />)

  return (
   <Routes>
  {/* Redirect root to Home */}
  <Route path="/" element={<Navigate to="/home" replace />} />

  {/* Home */}
  <Route path="/home" element={guard(<Home />)} />

  {/* Authentication */}
  <Route
    path="/auth"
    element={userData ? <Navigate to="/home" replace /> : <Auth />}
  />

  {/* History */}
  <Route
    path="/history"
    element={guard(<History />)}
  />

  {/* Notes */}
  <Route
    path="/notes"
    element={guard(<Notes />)}
  />

  {/* Pricing */}
  <Route
    path="/pricing"
    element={guard(<Pricing />)}
  />

  {/* Fallback */}
  <Route path="*" element={<Navigate to={userData ? "/home" : "/auth"} replace />} />
</Routes>
  )
}

export default App