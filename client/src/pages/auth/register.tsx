import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const navigate = useNavigate();
  const { register  } = useAuth();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await register({
      name,
      email,
      password,
      role,
      isOnBoarded: false
    });
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    alert(`Registered successfully`);

    if (user?.role === "ADMIN") {
      alert("Logged in successfully");
      navigate("/dashboard");
    } else {
      alert("Logged in successfully");
      navigate("/home");
    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f9f9f9]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Create an Account
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-4 rounded-xl bg-[#ededed] placeholder-gray-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
            className="w-full p-4 rounded-xl bg-[#ededed] placeholder-gray-500 focus:outline-none"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-[#111418] text-white font-bold leading-normal tracking-[0.015em]"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
