import './App.css'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmailVerifyPage from './pages/EmailVerifyPage'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage/>}/>
         <Route path="*" element={<p>404 Not Found</p>} />
         <Route path='/users/:userId/verify/:token' element={<EmailVerifyPage/>}/>
         <Route path='/' element={<LandingPage/>}/>
         <Route path='/chat' element={<ChatPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
