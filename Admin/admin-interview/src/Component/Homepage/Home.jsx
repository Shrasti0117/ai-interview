import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './Home.css'

const Home = () => {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="main-body">
        <Sidebar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home
