import React from 'react'
import { json } from 'stream/consumers';

export const IBCTransfer = (props) => {
    const {networkName="cosmoshub", balances, chainInfo, address} = props;
    return (
    <div>IBCTransfer shut up {networkName} {JSON.stringify(balances)}</div>
  )
}
