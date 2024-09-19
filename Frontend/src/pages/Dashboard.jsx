import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import NavBar from '../component/NavBar';
import { auth } from '../store/atom';

const Dashboard = () => {
  const [authStatus, setAuthStatus] = useRecoilState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin');
    } else if (!authStatus) {
      setAuthStatus(true);
    }
  }, [authStatus, setAuthStatus, navigate]);

  return (
    <div>
      <NavBar label={"Shop."} />
    </div>
  );
};

export default Dashboard;
