import React from 'react'
import Image from 'next/image'

const FeegrantCreatedPopup = () => {
  return (
    <div className='Feegrant-box3'>
        <div className='Feegrant3'>
            <h2>Grant Created</h2>
        </div>
        <div className='Feegrant3-Image'>
            <Image src="/Feegrantpopup.png" width={100} height={100} alt="Feegrant-Image" />
            <p>You have successfully updated the Grant</p>
        </div>
        <div className='Feegrant-Dismiss'>
            <h2>Dismiss</h2>
        </div>
    </div>
  )
}

export default FeegrantCreatedPopup