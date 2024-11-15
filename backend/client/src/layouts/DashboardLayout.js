import React, { useState } from 'react'
import Sidebar from '../components/backend/Sidebar'
import Navbar from '../components/backend/Navbar';
// import Navbar from '../frontend/Navbar'

const DashboardLayout = ({children}) => {
    const [open, setOpen] = useState(false);
  return (
    <>
    <Navbar setOpen={setOpen} />
    <Sidebar open={open} setOpen={setOpen} />
    <div className="sm:mx-8 sm:my-8 my-2 mx-2">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
    </div>
  </>
  )
}

export default DashboardLayout