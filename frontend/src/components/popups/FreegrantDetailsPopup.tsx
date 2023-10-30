import React from 'react'
import Image from 'next/image'

const FreegrantDetailsPopup = () => {
    return (
        <div className='Fregrant-box1'>
            <div className='Fregrant1'>
                <h2>Details</h2>
            </div>
            <div className='Fregrant1-Head'>
                <div className='Fregrant1-Head1'>
                    <div className='head1'>
                        <div className='head1-first'>Granter</div>
                        <div className='head1-main'>
                            <div className='head1-second'>cosmos1enruju0dnejv8v..</div>
                            <Image src="/copy-logo.png" width={24} height={24} alt="Copy-logo" />
                        </div>
                    </div>
                    <div className='headf2'>
                        <div className='headf2-first'>Grantee</div>
                        <div className='headf2-main'>
                            <div className='headf2-second'>cosmos1enruju0dnejv8v..</div>
                            <Image src="/copy-logo.png" width={24} height={24} alt="Copy-logo" />
                        </div>
                    </div> 
                </div>
                <div className='Fregrant1-Head2'>
                    <div className='headf'>
                        <div className='headf-first'>Spend Limit</div>
                        <div className='headf-main'>
                            <div className='headf-second'>100 STAKE</div>
                        </div>
                    </div>
                    <div className='headfpop'>
                        <div className='headfpop-first'>Expiration</div>
                        <div className='headfpop-main'>
                            <div className='headfpop-second'>2023-04-02 10-13-34</div>
                        </div> 
                    </div>
                </div>
            </div>
            <div className='Fregrant-dismiss'>
                <h2>Dismiss</h2>
            </div>
        </div>
    )
}

export default FreegrantDetailsPopup