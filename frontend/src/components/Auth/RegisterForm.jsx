import { User } from 'lucide-react';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import {toast} from "react-toastify";
import axios from "../../api/axios"
import { ClipLoader } from 'react-spinners';

export default function RegisterForm({toggleForm}) {

    const [form, setForm] = useState({firstName: "", lastName: "", email: "", password: ""});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("user/register", form);
            toast.success("Registered! Check your email to verify.");
            toggleForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally{
          setLoading(false);
        }
    }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-black/50 backdrop-blur-md text-white rounded-lg shadow-xl shadow-black/40 transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <div className="header text-center mb-4">
        <User className="h-8 w-8 text-white mx-auto mb-2" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-gray-600">Join our chat community today</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 mb-4">
        <label htmlFor="fname" className='font-bold'>First Name</label>
        <input type="text" id="fname" name='firstName' onChange={handleChange} className="border p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder='Enter your first name'/>

        <label htmlFor="lname" className='font-bold'>Last Name</label>
        <input type="text" id="lname" name='lastName' onChange={handleChange} className="border p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder='Enter your last name'/>

        <label htmlFor="email" className='font-bold'>Email</label>
        <input type="email" id="email" name='email' onChange={handleChange} className="border p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder='Enter your email'/>

        <label htmlFor="password"  className='font-bold'>Password</label>
        <input type="password" id="password" name='password' onChange={handleChange} className="border p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder='Enter your password'/>

        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-2.5 rounded text-white text-xs font-bold cursor-pointer mt-2">
         {loading ? (
            <>
              <ClipLoader size={18} color={"white"} />
              <span className="ml-2">Creating Account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>

      </form>

      <Divider variant="middle" />

      <p className="text-center mt-4 text-sm">
        Already have an account? <a onClick={toggleForm} className="ml-1 p-0 h-auto font-semibold text-blue-600 hover:text-purple-600 cursor-pointer">Sign In</a>
      </p>
    </div>
  );
}
