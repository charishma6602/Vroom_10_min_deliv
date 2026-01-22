import React from 'react'
import noData from '../assets/nothing_here.webp'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[75vh] gap-3'>
      <img
        src={noData}
        alt='no data'
        className='w-350 h-120 object-fill' 
      />
      <p className='text-neutral-500'>No Data</p>
    </div>
  )
}

export default NoData
