import React from 'react'
import Image from 'next/image'

const ActiveProposalsTable = () => {
  return (
    <div className='space-y-10'>
    <div className=''>
      <div className='table-Decison-text'>Active Proposals</div>
    </div>
    <div  className='space-y-6'>
      <table className='customTable'>
        <thead className='customTableHead'>
          <tr className='text-left'>
            <th >Propsal Name</th>
            <th>Status</th>
            <th>Proposers</th>
            <th>Policy Address</th>
            <th>Voting End Date</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4].map((item,index) => (
            <tr key={index} className=''>
              <td className='flex gap-2'>
                <div className="bg-[#3C3047] rounded-full h-[32px] w-[32px] flex justify-center items-center">
                  <Image src="/policy.png" height={21} width={24} alt="policy-img" />
                </div>
                <div className='proposal-name '>Proposal Name placeholder</div>
              </td>
              <td>
              <span className="pl-2 pr-2 ">
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
              <span className='text-[rgba(176,176,176,0.50)] text-[14px] pl-2'>at 2023-09-23</span>
              </td>
              <td>cosmos1eu0iejv8v...uk98h0</td>
              <td className="flex gap-2">
                <div className=''>cosmos1eu0dnejv8v..</div>
                <Image src="/copy.svg" height={17} width={14} alt="Copy-logo"  className="cursor-pointer"/>
              </td>
              <td>2023-09-21</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default ActiveProposalsTable