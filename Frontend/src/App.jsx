import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { auth } from './store/atom';
import Protected from './component/Protected';
import Product from './pages/Product';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';

const AppContent = () => {
  const setAuthStatus = useSetRecoilState(auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, set auth status to true
      setAuthStatus(true);
    }
    setLoading(false); // Stop loading after the token check
  }, [setAuthStatus]);

  if (loading) {
    return <div>Loading...</div>; // Show loading until token check is done
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route
          path='/'
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path='/products' element={
          <Protected>
            <Product />
          </Protected>
          }/>
        <Route path='/cart' element={
          <Protected>
            <Cart />
          </Protected>
          }/>
        <Route path='/account' element={
          <Protected>
            <AdminPanel />
          </Protected>
          }/>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
};

export default App;
