import React from 'react'
import Image from 'next/image'

function Multisigcreated() {
  return (
    <div className='members-limit-reach '>
    <div className='member-head'>
        <h2>MultiSig Created</h2>
    </div>
    <div className='member-image'>
        <Image src="/Feegrantpopup.png" width={100} height={100} alt="vote-image" />
        <p>You have succesfully created multisig</p>
    </div>
    <div className='member-button'>Dismiss</div>
</div>
  )
}

export default Multisigcreated