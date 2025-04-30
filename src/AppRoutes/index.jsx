import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/register';
import Dashboard from '../pages/Dashboard';
import MyNavbar  from '../Components/Navbar';

const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <BrowserRouter>
    <MyNavbar/>
      <Routes>
        <Route path="/loan-app" element={<Home />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user?.isAdmin ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
