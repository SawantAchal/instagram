import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import AuthPage from './pages/authPage/AuthPage'
import PageLayout from './Layouts/pageLayouts/PageLayout'
import ProfilePage from './pages/profilePage/ProfilePage'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase/firebase'

function App() {
  // const authUser = useAuthStore(state => state.user)
  const [authUser] = useAuthState(auth)
  return (
    <PageLayout>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />}/>
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />}/>
        <Route path='/:username' element={<ProfilePage />}/>
      </Routes>
    </PageLayout>
  )
}

export default App
