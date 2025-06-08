import React, { useState } from 'react'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'

export default function AuthPage() {
    const [isLogin, setLogin] = useState(true);

    const toggleForm =  () => {
        setLogin(!isLogin);
    }
  return (
    <div className='min-h-screen min-w-sceen  bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-center p-4'>
        {isLogin ? (<LoginForm toggleForm={toggleForm}/>) : <RegisterForm toggleForm={toggleForm}/>}
    </div>
  )
}
