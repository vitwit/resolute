import { REMOVE_ICON } from '@/constants/image-names';
import useGetAllAssets from '@/custom-hooks/multisig/useGetAllAssets';
import { shortenAddress } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

interface TxnMsgProps {
  msg: Msg;
  onDelete: (index: number) => void;
  currency: Currency;
  index: number;
  chainID: string;
}

const SendMessage = (props: TxnMsgProps) => {
  const { msg, index, onDelete, chainID } = props;
  const { getParsedAsset } = useGetAllAssets();
  const { assetInfo } = getParsedAsset({
    amount: msg.value?.amount?.[0]?.amount,
    chainID,
    denom: msg.value?.amount?.[0]?.denom,
  });
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2 items-center">
        <div className="truncate">
          <span>Send&nbsp;</span>
          <span className="msg-amount">
            {assetInfo?.amountInDenom}
            &nbsp;
            {assetInfo?.displayDenom}&nbsp;
          </span>
          <span>to&nbsp;</span>
          <span className="font-extralight">
            {shortenAddress(msg.value.toAddress, 20)}
          </span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src={REMOVE_ICON}
            height={24}
            width={24}
            alt="Remove"
            draggable={false}
          />
        </span>
      ) : null}
    </div>
  );
};

export default SendMessage;
