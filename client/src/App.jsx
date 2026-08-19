import { Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Auth from "./pages/Auth.jsx"
import History from "./pages/History.jsx"
import Notes from "./pages/Notes.jsx"
import Pricing from "./pages/Pricing.jsx"
import { useEffect } from 'react'
import { getCurrentUser } from './services/api.js'
import {useDispatch, useSelector} from 'react-redux'
export const serverUrl = "https://notes-generator-wsa2.onrender.com"

function App () {
  const dispatch = useDispatch()
  useEffect(()=>{
    getCurrentUser(dispatch)
  },[dispatch])

  const {userData} = useSelector((state)=>state.user)


  return (
    <>
   <Routes>
  {/* Home */}
  <Route
    path="/"
    element={userData ? <Home /> : <Navigate to="/auth" replace />}
  />

  {/* Authentication */}
  <Route
    path="/auth"
    element={userData ? <Navigate to="/" replace /> : <Auth />}
  />

  {/* History */}
  <Route
    path="/history"
    element={userData ? <History /> : <Navigate to="/auth" replace />}
  />

  {/* Notes */}
  <Route
    path="/notes"
    element={userData ? <Notes /> : <Navigate to="/auth" replace />}
  />

  {/* Pricing */}
  <Route
    path="/pricing"
    element={userData ? <Pricing /> : <Navigate to="/auth" replace />}
  />
</Routes>
    </>
  )
}

export default App