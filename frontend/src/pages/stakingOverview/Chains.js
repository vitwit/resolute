import React from 'react'
import { Chain } from './Chain'

export const Chains = (props) => {

  return (

    <>
     {
        props.chains.map((chain) => <Chain chain={chain} key={chain.chainName}/>)
     }
    </>
   
  )
}
