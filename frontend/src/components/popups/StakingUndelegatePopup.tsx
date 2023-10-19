import Image from 'next/image';
import React from 'react';

const StakingPopup1 = () => {
    return (
        <div className='Staking-box'>
            <div className='staking-header'>
                <Image src="/stakingimage.png" width={32} height={32} alt="Staking" />
                <h2>Simd_Val</h2>
                <Image className="absolute right-6" src="/close.svg" width={40} height={40} alt="close" />
            </div>
            <div className='staking-text1'>
                Comission : 10.00%
            </div>
            <div className='staking-text2 space-y-2 '>
                <h2> Once the unboinding period begins you will : </h2>
                <div className='staking-points '>
                    <p>1. You will not receive staking rewards</p>
                    <p>2. You will not receive staking rewards</p>
                    <p>3. You will not receive staking rewards</p>
                </div>
            </div>
            <div className='unavilable-delegation'>
                <div className='p'> Available for Un-Delegation </div>
                <div className='num'>30.1235647</div>
            </div>
            <div className='staking-h'>
                <div className='staking-Amo'>
                    Amount*
                </div>
                <div className='holder justify-between'>
                    <p>Enter here</p>
                    <p className='stake'>Stake</p>
                </div>
            </div>
            <div className='staking-buttons'>
                <button className='staking-cancel'>Cancel</button>
                <button className='undelegate'>UnDelegate</button>
            </div>
        </div>
    )
}

export default StakingPopup1