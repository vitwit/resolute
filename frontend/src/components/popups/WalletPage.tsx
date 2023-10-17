import React from "react";
import Image from 'next/image'

const Walletpage = () => {
    return (
        <div className="custom-box flex-col">
            <div className="header " >
                <h2>Add Wallet</h2>

                <Image src="/close.svg" width={40} height={40} alt="close" />

            </div>
            <div className="container" >
                <div className="wallet">
                    <Image src="/Keplrwallet.png" width={100} height={100} alt="Keplrwallet" />
                    <p className="text">Keplr Wallet</p>
                </div>
                <div className="wallet">
                    <Image src="/Leapwallet.png" width={100} height={100} alt="Leap Wallet" />
                    <p className="text">Leap Wallet</p>
                </div>
                <div className="wallet">
                    <Image src="/cosmostation.png" width={100} height={100} alt="cosmostation" />
                    <p className="text">Cosmostation </p>
                </div>
            </div>






        </div>
    )
}

export default Walletpage;