import { time } from 'console';
import React from 'react';

const TransactionData: () => Transaction = () => {
  const transactionHash = '9EE782AA6EA9FA411244716523498C711';
  const fee: Coin[] = [];
  const gasUsed = '530,20,9574';
  const gasWanted = '509,203,987';
  const memo =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  const height = '1034';
  const rawLog = '';
  const msgs: Msg[] = [];
  const chainID = '';
  const address = '';
  const time = '';
  const code = 2;

  return {
    memo,
    code,
    height,
    rawLog,
    transactionHash,
    gasUsed,
    gasWanted,
    fee,
    time,
    msgs,
    chainID,
    address,
  };
};

export default TransactionData;
