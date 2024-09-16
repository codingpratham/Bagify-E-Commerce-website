import React from 'react';
import InputBox from '../component/InputBox';
import Button from '../component/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil'; 
import { auth } from '../store/atom'; 
import Warning from '../component/Warning';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authstatus, setAuthStatus] = useRecoilState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/signin', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      setAuthStatus(true);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login your account</h2>
        <form className="space-y-4">
          <div>
            <InputBox
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <InputBox
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              label={"Signin"}

              onClick={handleSubmit}
            />
            <Warning label={"Create account" }navigate={"signup"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
