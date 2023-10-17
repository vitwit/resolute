import React from 'react'
import Image from 'next/image'

const Stakingpopup2 = () => {
    return (
        <div className='staking-box2'>
            <div className='staking-head'>
                <div className='Staking2-header'>
                    <Image src="/stakingimage.png" width={32} height={32} alt="Staking" />
                    <h2>Simd_Val</h2>
                    <Image className="absolute right-6" src="/close.svg" width={40} height={40} alt="close" />
                </div>
                <div className='staking2-text'>
                    <p>Comission : 10.00%</p>
                </div>
            </div>
            <div className='staking-head2'>
                <div className='head'>
                    <div className='para-h'>Staking will lock your funds for 21+ days</div>
                    <div className='para'>
                        <p>You will not receive staking rewardsYou will not receive staking rewardsYou will not receive staking rewardsYou will not receive staking rewards</p>
                    </div>
                    <div className='un-delegation g'>
                        <div className='p1'>Available for Un-Delegation</div>
                        <div className='num1'>30.1235647</div>
                    </div>
                    <div className='staking-h2'>
                        <div className='staking-Amont'>
                            Amount*
                        </div>
                        <div className='holder1 justify-between'>
                            <p>Enter here</p>
                            <p className='stake2'>Stake</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='staking2-buttons'>
                <button className='staking2-cancel'>Cancel</button>
                <button className='delegate'>Delegate</button>
            </div>
        </div>
    )
}

export default Stakingpopup2