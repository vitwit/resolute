import React from 'react'
import Image from 'next/image'

const FeegrantRevokePopup = () => {
  return (
    <div className='Feegrant-box2'>
        <div className='Feegrant2'>
            <h2>Revoke Grant</h2>
        </div>
        <div className='Feegrant2-Image'>
            <Image src="/Feegrantpopup.png" width={100} height={100} alt="Revoke Grant" />
            <p>Are you sure you want to revoke the Grant ?</p>
        </div>
        <div className='Feegrant2-buttons'>
            <button className='Feegrant2-cancel'>Cancel</button>
            <button className='Revoke'>Revoke</button>
        </div>
    </div>
  )
}

export default FeegrantRevokePopup