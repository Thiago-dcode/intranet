import { useState } from 'react'
import mantenimiento from '../assets/img/mantenimiento.png'

function Home() {
  const [count, setCount] = useState(0)

  return (
   
        <div  className='bg-arzumaBlack text-cyan-500 h-screen'>
          <img className='object-cover' src={mantenimiento} alt="En mantenimiento" />
      </div>

  )
}

export default Home
