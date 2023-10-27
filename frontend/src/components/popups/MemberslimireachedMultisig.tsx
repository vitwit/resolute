import React from 'react'
import Image from 'next/image'

function MemberslimireachedMultisig() {
  return (
    <div className='members-limit-reach '>
    <div className='member-head'>
        <h2>Member Limit Reached</h2>
    </div>
    <div className='member-image'>
        <Image src="/member.png" width={100} height={100} alt="vote-image" />
        <p>You have reached the limit to add the team members.</p>
    </div>
    <div className='member-button'>Dismiss</div>
</div>
  )
}

export default MemberslimireachedMultisig