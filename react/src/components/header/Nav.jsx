import React from 'react'

export default function Nav({children}) {
  return (
    <nav className=" w-full max-w-4xl px-4 py-4 flex justify-between items-center"> 
    {children}

    </nav>
  )
}
