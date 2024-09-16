import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { auth } from '../store/atom';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const authstatus = useRecoilValue(auth);  

  if(!authstatus) {
    return <>
    <h1>
      you need to log in to access this page
    </h1>
    </>
  } 
  
  return (
    <div>Dashboard</div>
  );
};

export default Dashboard;
