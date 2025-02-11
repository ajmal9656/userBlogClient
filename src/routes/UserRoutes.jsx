import React from 'react'
import { Routes,Route } from 'react-router-dom';
import Register from '../components/Register';
import Otp from '../components/Otp';
import Login from '../components/login';
import Profile from '../components/Profile';
import BlogDetails from '../components/BlogDetails';
import Blogs from '../components/Blogs';
import UserProtect from './protectedRoute/UserProtect';
import UserProfileProtect from './protectedRoute/UserProfileProtect';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/otp" element={<Otp/>} />
      <Route path="/login" element={<UserProtect><Login/></UserProtect>} />
      
      <Route path="/" element={<Blogs />} />
      <Route path="/profile" element={<UserProfileProtect><Profile /></UserProfileProtect>} />
      <Route path="/blog-details" element={<BlogDetails />} />
      
           
      
      
      
    </Routes>
  )
}

export default UserRoutes
