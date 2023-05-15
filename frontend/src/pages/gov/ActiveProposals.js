import React from 'react'
import Proposals from './Proposals'
import { useSelector } from 'react-redux';
import ConnectWallet from '../../components/ConnectWallet';

function ActiveProposals() {

    const walletConnected = useSelector((state) => state.wallet.connected);
    const networks = useSelector((state) => state.wallet.networks);

    return (
        <>
            {
                walletConnected ?
                    Object.keys(networks).map((key, index) => (
                        <>
                            <Proposals
                                restEndpoint={networks[key].network?.config?.rest}
                                chainName={networks[key].network?.config?.chainName}
                                chainLogo={networks[key]?.network?.logos?.menu}
                                signer={networks[key].walletInfo?.bech32Address}
                                gasPriceStep={networks[key].network?.config?.gasPriceStep}
                                aminoConfig={networks[key].network.aminoConfig}
                                bech32Config={networks[key].network?.config.bech32Config}
                                chainID={networks[key].network?.config?.chainId}
                                currencies={networks[key].network?.config?.currencies}
                                key={index}
                            />
                        </>
                    ))
                    :
                    <ConnectWallet />
            }
        </>
    )
}

export default ActiveProposals