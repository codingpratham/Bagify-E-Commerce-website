import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import { RecoilRoot } from 'recoil';
import Protected from './component/Protected';

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />

          {/* Protected routes */}
          <Route
            path='/'
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
