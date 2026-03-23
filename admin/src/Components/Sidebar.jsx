import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoMdAddCircleOutline, IoIosLogOut } from 'react-icons/io'
import { MdFormatListBulleted, MdChecklistRtl } from 'react-icons/md';

const Sidebar = ({ setToken }) => {
  return (
    <div className="w-[20%] sm:w-[15%] md:w-[22%] min-h-screen border-r-2 border-gray-100 bg-white flex flex-col items-center md:items-stretch">
      <div className='mt-4 px-2 md:px-6 text-center md:text-left text-fuchsia-600 md:text-black'>
        <h2 className='text-[32px] font-bold hidden md:block'>Admin Panel</h2>
        <h6 className='text-1xl font-bold md:hidden'>Admin</h6>
      </div>
      <div className='flex flex-col gap-4 pt-6 w-full'>
        <NavLink to="/add" className='flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-fuchsia-500 hover:text-white transition-all'>
          <IoMdAddCircleOutline className="text-[30px] md:text-[35px]" />
          <p className=" hidden md:block text-base"> Add Rooms</p>
        </NavLink>

        <NavLink to="/list" className='flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-fuchsia-500 hover:text-white transition-all'>
          <MdFormatListBulleted className="text-[30px] md:text-[35px]" />
          <p className=" hidden md:block text-base"> Rooms List</p>
        </NavLink>

        <NavLink to="/reservation" className='flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-fuchsia-500 hover:text-white transition-all'>
          <MdChecklistRtl className="text-[30px] md:text-[35px]" />
          <p className=" hidden md:block text-base">Reservations</p>
        </NavLink>

        <NavLink to="/rooms" className='flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-fuchsia-500 hover:text-white transition-all'>
          <MdChecklistRtl className="text-[30px] md:text-[35px]" />
          <p className=" hidden md:block text-base"> Admin Booking</p>
        </NavLink>

        <button onClick={() => setToken("")} className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-6 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-fuchsia-500 hover:text-white w-full text-center md:text-left transition-all">
          <IoIosLogOut className="text-[30px] md:text-[35px]" />
          <p className=" hidden md:block text-base">Logout</p>
        </button>

      </div>
    </div>
  )
}

export default Sidebar