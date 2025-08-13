/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    

    try {
      const res= await axios.put(`${import.meta.env.VITE_API_URL}/auth/onboard`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    console.log(res.data);
        
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    alert('Onboarding completed!');
    if(user?.role === "ADMIN"){
        navigate("/dashboard")
      }else{
        navigate("/home")
      }
      
    } catch (error) {
      alert('Onboarding failed.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f9f9f9]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Complete Your Profile
        </h2>

        {[
          { label: 'Address', name: 'address' },
          { label: 'Phone', name: 'phone' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'Country', name: 'country' },
          { label: 'Postal Code', name: 'postalCode' },
        ].map(({ label, name }) => (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 font-medium mb-2">
              {label}
            </label>
            <input
              type="text"
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              required
              placeholder={`Enter your ${label.toLowerCase()}`}
              className="w-full p-4 rounded-xl bg-[#ededed] placeholder-gray-500 focus:outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
