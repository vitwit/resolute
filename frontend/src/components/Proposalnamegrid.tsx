import React from 'react'
import Image from 'next/image'

const Proposalnamegrid = () => {
  return (
    <div className='proposalname-grid'>
      <div className=' space-y-6'>
        <div className='Proposal-title '>

          <div className="bg-[#2DC5A4] rounded-full h-[32px] w-[32px] flex justify-center items-center">
            <Image src="/Policyname.png" width={19} height={19} alt="policy" />
          </div>
          <div className='Proposal-Name'>Proposal Name placeholder</div>
          <div className='end-title'>
            <span className='pl-2 pr-2'>
              <Image
                className="inline"
                src="./active-icon.svg"
                width={24}
                height={24}
                alt="Submiited"
              />
            </span>
            <span className="text-[#2DC5A4] text-[14px] leading-3">
              Submiited
            </span>
          </div>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <div className='Group-details w-full '>
        <div className='headGroup1'>
          <div className='Group-first'>Created At</div>
          <div className='Group-second'>2023-09-13 16:54:54</div>
        </div>
        <div className='headGroup1'>
          <div className='Group-first'>Voting Ends</div>
          <div className='Group-second'>2023-09-13 16:54:54</div>
        </div>
        <div className='head-Group2'>
          <div className='Group2-first'>Group’s Address</div>
          <div className='Group2-second'>
            <div className='Group2-Address'>cosmos1enruju0dnejv8v..</div>
            <Image src="/copy-logo.png" width={24} height={24} alt="Copy-logo" className="cursor-pointer" />
          </div>
        </div>
        <div className='head-Group2'>
          <div className='Group2-first'>Group’s Address</div>
          <div className='Group2-second'>
            <div className='Group2-Address'>cosmos1enruju0dnejv8v..</div>
            <Image src="/copy-logo.png" width={24} height={24} alt="Copy-logo" className="cursor-pointer" />
          </div>
        </div>
        <div className='headGroup1'>
          <div className='Group-first'>Forum</div>
          <div className='Group-second'>https:/search.google.com</div>
        </div>


      </div>
      <div className='updatebutton'>Update</div>
    </div>
  )
}

export default Proposalnamegrid