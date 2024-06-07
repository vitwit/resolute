import { I_ICON } from '@/constants/image-names';
import { TXN_BUILDER_MSGS } from '@/constants/multisig';
import useGetChainInfo from '@/custom-hooks/useGetChainInfo';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const TxnBuilder = ({ chainID }: { chainID: string }) => {
  const { getChainInfo, getDenomInfo } = useGetChainInfo();
  const basicChainInfo = getChainInfo(chainID);
  const { decimals, displayDenom, minimalDenom } = getDenomInfo(chainID);
  const currency = {
    coinDenom: displayDenom,
    coinDecimals: decimals,
    coinMinimalDenom: minimalDenom,
  };
  const {
    address,
    baseURL,
    restURLs: baseURLs,
    feeAmount,
    prefix,
    rest,
    rpc,
  } = basicChainInfo;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      gas: 900000,
      memo: '',
      fees: feeAmount * 10 ** currency.coinDecimals,
      msgs: [],
    },
  });
  return (
    <form className="mt-10 h-full flex gap-10">
      <SelectMessage />
      <DividerLine />
      <MessagesList />
    </form>
  );
};

export default TxnBuilder;

const SelectMessage = () => {
  return (
    <div className="w-[35%]">
      <div className="text-b1">Add Messages</div>
      <div className="space-y-6">
        <div className="flex gap-2">
          <div className="text-b1-light">Select Message</div>
          <Image src={I_ICON} height={20} width={20} alt="" />
        </div>
        <div>
          {TXN_BUILDER_MSGS.map((msg) => (
            <button type="button">{msg}</button>
          ))}
        </div>
      </div>
      <div>Gas Fees</div>
      <div>Memo</div>
    </div>
  );
};

const DividerLine = () => {
  return <div className="h-full w-[1px] bg-[#ffffff80] opacity-20"></div>;
};

const MessagesList = () => {
  return <div className="flex-1">Messages List</div>;
};
