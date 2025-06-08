import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
   <AuthProvider>
    <>
      <App />
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  </AuthProvider>
)
