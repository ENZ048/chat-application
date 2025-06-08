import './App.css'
import AuthPage from './pages/AuthPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage/>}/>
         <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
