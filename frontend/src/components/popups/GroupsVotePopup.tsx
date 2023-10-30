import React from 'react'
import Image from 'next/image'

const GroupsVotePopup = () => {
  return (
    <div className='Groups-vote-grid'>
        <div className='vote-head'>
            <h2>You have Voted !</h2>
        </div>
        <div className='vote-Image'>
            <Image src="/vote.png" width={100} height={100} alt="vote-image" />
            <p> You have successfully casted your vote, click on dismiss to go back</p>
        </div>
        <button className='vote-button'>Dismiss</button>
    </div>
  )
}

export default GroupsVotePopup