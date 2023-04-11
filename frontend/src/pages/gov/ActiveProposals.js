import React from 'react'
import Proposals from './Proposals'
import { getMainNetworks } from '../../utils/networks'

function ActiveProposals() {
    const chains = getMainNetworks();
  return (
    <div>
        {
            chains.map((key, index) => (
                <>
                    <Proposals chainUrl={key.config.rest} chainName={key.config.chainName} chainLogo={key.logos.menu}/>
                </>
            ))
        }
    </div>
  )
}

export default ActiveProposals