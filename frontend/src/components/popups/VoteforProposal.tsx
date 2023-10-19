import React from 'react'
import Image from 'next/image'

const VoteforProposal = () => {
  return (
    <div className='VoteforProposal-popup'>
        <div className='vote-name'>
            <div className='vote-text'>Vote for Proposal #6 Proposal NAME</div>
            <Image className="absolute right-0" src="/close.svg" width={40} height={40} alt="close" />
        </div>
        <div className='VoteProposal-buttons'>
        <button className='Proposal'>Yes</button>
        <button className='Proposal'>No</button>
        
        </div>
        <div className='VoteProposal-buttons'>
        <button className='Proposal'>Yes</button>
        <button className='Proposal'>No</button>
        </div>
        <div className='voteproposal-text'>
            <p>Justification</p>
            <div className='voteproposal-message'>
            <p>Enter here</p>
        </div>
        </div>
       <button className='vote-confirm'>Confirm</button>
    </div>
  )
}

export default VoteforProposal