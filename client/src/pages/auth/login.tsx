import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
   const navigate = useNavigate();
  const { login  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password)
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if(user?.role === "USER"){
        alert("Logged in successfully")
        navigate("/home")
      }else{
        alert("Logged in successfully")
        navigate("/dashboard")
      }
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f9f9f9]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-4 rounded-xl bg-[#ededed] placeholder-gray-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-4 rounded-xl bg-[#ededed] placeholder-gray-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p className="text-sm text-center text-gray-500 underline mb-4 cursor-pointer">
          Forgot Password?
        </p>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
