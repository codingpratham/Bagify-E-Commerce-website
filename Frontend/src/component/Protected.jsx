import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { auth } from '../store/atom';
import { useNavigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const authstate = useRecoilValue(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authstate) {
      navigate('/signin'); 
    }
  }, [authstate, navigate]); 

  if (!authstate) {
    return null;  
  }

  return children;
};

export default Protected;
