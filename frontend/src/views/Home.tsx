import { useState } from 'react'
import '../App.css'
import Wrapper from '../container/Wrapper'
function Home() {
  const [count, setCount] = useState(0)

  return (
    <Wrapper>
        <div className='bg-slate-800 text-cyan-500'>
        Intranet Arzuma
      </div>
    </Wrapper>
  )
}

export default Home
