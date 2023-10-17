import React from 'react'
import Image from 'next/image'

const LogoutPopup = () => {
  return (
   <div className='Logout-box'>
    <div className='title'>
        <h2>Logout</h2>
    </div>
    <div className='Logoutimage'>
        <Image  src="/Logout.png" width={100} height={100} alt="Logout" />
    
    <p className='Logout-text' >Are you sure you want to Logout.</p>
    </div>
    <div className='flex w-full justify-betwen gap-10' >
        <button className='cancel1-button'>Cancel</button>
        <button className='Logout-button'>Logout</button>
    </div>
    </div>

  
  )
}

export default LogoutPopup