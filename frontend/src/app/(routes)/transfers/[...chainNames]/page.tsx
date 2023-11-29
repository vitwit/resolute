'use client'

import React from 'react';
import '../transfers.css';
import Transfers from '../components/Transfers';
import { useParams } from 'next/navigation';


const Page = () => {
  const params = useParams();
  const paramChains = params.chainNames;
  const chainNames =
    typeof paramChains === 'string' ? [paramChains] : paramChains;

  return <Transfers chainNames={chainNames} />;
};

export default Page;
