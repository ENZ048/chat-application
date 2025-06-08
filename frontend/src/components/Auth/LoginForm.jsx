import { LogIn } from 'lucide-react';
import Divider from '@mui/material/Divider';
import axios from '../../api/axios';
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

export default function LoginForm({toggleForm}) {

    const [form, setForm] = useState({email: "", password: ""});
    const {setUser} = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/user/login", form);
            setUser(res.data.user);
            navigate("/chat");
        } catch (error){
            toast.error(error.response?.data?.message || "Login Failed")
        }
    }


  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-2xs border-1 border-gray-300">
      <div className="header text-center mb-4">
        <LogIn className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome Back!</h1>
        <p className="text-gray-600">Sign in to continue to your chat</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 mb-4">
        <label htmlFor="email" className='font-bold'>Email</label>
        <input type="email" id="email" name='email' onChange={handleChange} className="border p-2 rounded border-gray-300" placeholder='Enter your email'/>

        <label htmlFor="password"  className='font-bold'>Password</label>
        <input type="password" id="password" name='password' onChange={handleChange} className="border p-2 rounded border-gray-300" placeholder='Enter your password'/>

        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-2.5 mt-2 rounded text-white text-xs font-bold cursor-pointer">Sign In</button>
      </form>

      <Divider variant="middle" />

      <p className="text-center mt-4 text-sm">
        Don't have an account? <a onClick={toggleForm} className="ml-1 p-0 h-auto font-semibold text-blue-600 hover:text-purple-600 cursor-pointer">Sign Up</a>
      </p>
    </div>
  );
}
