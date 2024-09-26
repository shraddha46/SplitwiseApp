import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from './component/HomePage/HomePage';
import Login from './component/Auth/Login';
import SignUp from './component/Auth/SignUp';
import DashBoard from './component/DashBoard/DashBoard';
import DrawerLayout from './component/Layout/DrawerLayout';
import AllExpenses from './component/Expense/AllExpenses';
import Header from './component/Header/Header';
import CRoute from './PrivateRoute';
import { UserProvider } from './UserContext';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const drawerRoutes = ['/dashboard', '/all-expenses'];
  const isDrawerRoute = drawerRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      {isDrawerRoute ? (
        <DrawerLayout>
          <Routes>
            <Route path="/dashboard" element={<CRoute element={<DashBoard />} />} />
            <Route path="/all-expenses" element={<CRoute element={<AllExpenses />} />} />
          </Routes>
        </DrawerLayout>
      ) : (
        <Routes>
          <Route path="/" element={<CRoute element={<HomePage />} cPublic />} />
          <Route path="/login" element={<CRoute element={<Login />} cPublic />} />
          <Route path="/signup" element={<CRoute element={<SignUp />} cPublic />} />
        </Routes>
      )}
    </>
  );
};

export default App;