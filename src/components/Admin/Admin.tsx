
import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import OrderDetail from './OrderDetails'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DashBoard from './DashBoard';
import AddProducts from './AddProducts';


const AdminDashboard = () => {
  
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              setIsAuthenticated(true);
          } else {
              setIsAuthenticated(false);
              navigate("/login"); 
          }
      });
      return () => unsubscribe();
  }, [auth, navigate]);

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }
  return (

    <>
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><a href="/my-first-reactjs-project/#/admin/dashboard">Dashboard</a></li>
          <li><a href="/my-first-reactjs-project/#/admin/users">Users</a></li>
          <li><a href="/my-first-reactjs-project/#/admin/products">Products</a></li>
          <li><a href="/my-first-reactjs-project/#/admin/orders">Orders</a></li>
        </ul>
      </div>
      {/* Router */}
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/users" element={<h1>Users</h1>} />
        <Route path="/products" element={<AddProducts />} />
        <Route path="/orders" element={<OrderDetail />} />
      </Routes>
    </>
    
  )
}

export default AdminDashboard