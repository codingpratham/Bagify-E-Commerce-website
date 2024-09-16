import React, { useState } from 'react'
import Button from '../component/Button'
import InputBox from '../component/InputBox'
import Heading from '../component/Heading'
import {useNavigate} from 'react-router-dom'
import Warning from '../component/Warning'
import axios from 'axios'
const Signup = () => {

    const [fullname,setFullname]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
        try {
          
          const res = await axios.post('http://localhost:3000/api/v1/user/signup', {
            fullname,
            email,
            password
          });
          localStorage.setItem('token', res.data.token);
          navigate('/');
          setLoading(false); 
        } catch (error) {
          console.error('Error signing up:', error);
          setLoading(false); 
        }
      };

        if(loading){
            return <div className="text-center">Loading...</div>
        }
    
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md">
      <Heading/>
      <form className="space-y-4">
        <div>
          <InputBox
            type="text" 
            placeholder="Full Name" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e)=>setFullname(e.target.value)}
            value={fullname}
          />
        </div>
        
        <div>
          <InputBox
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div>
          <InputBox 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"

            onChange={(e)=>setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            label={"Create My Account"}
            
            onClick={handleSubmit}
          />
          <Warning label={"Already have an account" }navigate={"signin"} />
        </div>
      </form>
    </div>
  </div>
  )
}

export default Signup