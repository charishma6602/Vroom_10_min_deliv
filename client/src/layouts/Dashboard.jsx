import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  return (
    <section className='bg-white pt-1'>
      <div className='container mx-auto p-3 flex'>
        
        {/* Left Sidebar */}
        <div className='w-[240px] min-h-[calc(100vh-96px)] border-r pr-3'>
          <UserMenu />
        </div>

        {/* Divider Bar */}
        {/* Optional: remove if you don't want this visible bar */}
        <div className='w-[1px] bg-gray-300'></div>

        {/* Right Page Content */}
        <div className='flex-1 ml-0 bg-white min-h-[75vh] p-5 rounded-lg shadow-sm'>
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default Dashboard
