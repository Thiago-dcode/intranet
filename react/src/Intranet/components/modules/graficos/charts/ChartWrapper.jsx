import React from 'react'

export default function ChartWrapper({title,children}) {
  return (
    <div className='flex items-center flex-col bg-white border-4  rounded-md w-full h-2/3 lg:w-[49%]'>
        <h2>{title}</h2>
        {children}</div>
  )
}
