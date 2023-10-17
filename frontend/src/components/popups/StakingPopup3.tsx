import React from 'react'
import Image from 'next/image'

const StakingPopup3 = () =>{
  return (
    <div className='staking-box3'>
      <div className='staking3-head'>
        <div className='Staking2-header'>
            <Image src="/stakingimage.png" width={32} height={32} alt="Staking" />
               <h2>Simd_Val</h2>
            <Image className="absolute right-6" src="/close.svg" width={40} height={40} alt="close" />
           </div>
           <div className='staking2-text'>
              <p>Comission : 10.00%</p>
            </div>
        </div>
        <div className='staking3-head2'>
          <div className='head3'>Destination*</div>
          <div className='staking3-select'>
            <div className='staking3-holder '>
              <p>Select Here</p>
              <Image  src="/Arrow.png" width={14} height={7.93334} alt="Arrow" />
            </div>
          </div>
        </div>
        <div className='staking3-head3'>
          <div className='head4'>
            <div className='ps3'>Available for Un-Delegation</div>
            <div className='s3-num1'>30.1235647</div>
          </div>
          <div className='stake-head4'>
            <p>Amount*</p>
            <div className='holders3 justify-between'>
              <p>Enter here</p>
              <p className='stakes3'>Stake</p>
            </div>
          </div>
          
        </div>
        <div className='staking3-buttons'>
          <button className='staking3-cancel'>Cancel</button>
           <button className='delegates3'>Delegate</button>
         </div>
      </div>
  )
}

export default StakingPopup3