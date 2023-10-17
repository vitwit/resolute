import React from 'react'
import { useRouter } from 'next/router'

const OverviewPage = ({networks}) => {
  const router = useRouter()
  return (
     <p>Networks: {JSON.stringify(networks)}</p>
  )
}

export default OverviewPage