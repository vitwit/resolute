import React from 'react'
import Image from 'next/image'


const Groupspage2 = () => {
    return (
        <div className='Groups-page2'>
            <div className='Groups-Main'>
                <div  className='space-y-6' >
                    <div className='group-title'>
                        <Image src="/GroupImage.png" width={32} height={32} alt="Groupimage" />
                        <div className='titlegrp-Name'>Group Name</div>
                        <div className='end-title'>Est. 2023-09</div>
                    </div>
                    <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                </div>
                <div className='Group-details w-full '>
                    <div className='headGroup1'>
                        <div className='Group-first'>Forum</div>
                        <div className='Group-second'>https:/search.google.com</div>
                    </div>
                    <div className='head-Group2'>
                        <div className='Group2-first'>Group’s Address</div>
                        <div className='Group2-second'>
                            <div className='Group2-Address'>cosmos1enruju0dnejv8v..</div>
                            <Image src="/copy-logo.png" width={24} height={24} alt="Copy-logo" />
                            <div className='Group2-Edit'>Edit</div>
                        </div>
                    </div>
                    <div className='headGroup1'>
                        <div className='Group-first'>Total Weight</div>
                        <div className='Group-second'>2</div>
                    </div>
                    <div className='headGroup1'>
                        <div className='Group-first'>Total Members</div>
                        <div className='Group-second'>2</div>
                    </div>
                </div>
                <div className='Group2buttons'>
                    <div className='updatebutton'>Update</div>
                    <div className='leaveButton'>Leave</div>
                </div>
            </div>
        </div>
    )
}

export default Groupspage2