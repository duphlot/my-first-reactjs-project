
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OrderDetail from './OrderDetails'


const AdminDashboard = () => {
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
        <Route path="/dashboard" element={<h1>Admin Dashboard</h1>} />
        <Route path="/users" element={<h1>Users</h1>} />
        <Route path="/products" element={<h1>Products</h1>} />
        <Route path="/orders" element={<OrderDetail />} />
      </Routes>
    </>
    
  )
}

export default AdminDashboard