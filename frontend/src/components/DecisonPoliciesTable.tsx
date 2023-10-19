import React from 'react'
import Image from 'next/image'

const DecisonPoliciesTable = () => {
    
  return (
    <div className='space-y-6'>
        <div className='table-main w-full'>
            <div className='table-Decison-text'>Decision Policies</div>
            <button className='Attach-policy'>Attach Policy</button>
        </div>
        <div>
            <table className='customTable '>
                <thead className='customTableHead '>
                    <tr className='text-left font-medium'>
                        <th className='w-1/6 '>Name</th>
                        <th className='w-1/6 '>Description</th>
                        <th className='w-1/4 '>Address</th>
                        <th className='w-1/6 '>Quorum</th>
                        <th className='w-1/6 '>Voting Period</th>
                        <th className='w-1/4 '>Execution Delay</th>
                    </tr>
                </thead>
                <tbody>
                    {[1,2,3,4].map((item, index) => (
                        <tr key={index} className=''>
                            <td className='flex gap-2'>
                                <div className="bg-[#3C3047] rounded-full h-[32px] w-[32px] flex justify-center items-center">
                                <Image src="/policy.png" height={21} width={24} alt="policy-img" />
                                </div>
                                <div className='policy-name '>My Policy Name</div>
                            </td>
                            <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do </td>
                            <td className="flex gap-2">
                                <div className='font-light' >cosmos1eu0dnejv8v..</div>
                                <Image src="/copy.svg" height={17} width={14} alt="Copy-logo"  className="cursor-pointer"/>
                            </td>
                            <td>1%</td>
                            <td >21 Days</td>
                            <td >07 Days</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default DecisonPoliciesTable