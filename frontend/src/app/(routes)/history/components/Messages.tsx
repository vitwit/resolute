import Image from 'next/image';
import React from 'react';

type MessageDetailProps = {
  msgType: string;
  validator: string;
  amount: string;
  claimRewards: string;
};

const MsgDetails: MessageDetailProps[] = [
  {
    msgType: 'Delegate',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Send',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Delegate',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Vote',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Delegate',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Send',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Delegate',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
  {
    msgType: 'Vote',
    validator: 'StakeFish',
    amount: '120 AKT',
    claimRewards: '120 AKT',
  },
];

const MessageDetail: React.FC<MessageDetailProps> = ({
  msgType,
  validator,
  amount,
  claimRewards,
}) => (
  <div className="msg-grid">
    <div className="flex justify-between msg-type-bg">
      <p className="text-b1">{msgType}</p>
      <p className="secondary-btn">Cancel</p>
    </div>
    <div className="flex justify-between items-start w-full px-6 py-0">
      <div className="flex flex-col justify-center items-start gap-4">
        <p className="text-small">Validator</p>
        <div className="flex space-x-2">
          <Image src="/avatar.svg" width={24} height={24} alt="validator" />
          <p className="text-b1">{validator}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-start gap-4">
        <p className="text-small">Amount</p>
        <p className="text-b1">{amount}</p>
      </div>
      <div className="flex flex-col justify-center items-start gap-4">
        <p className="text-small">Auto Claim Rewards</p>
        <p className="text-b1">{claimRewards}</p>
      </div>
    </div>
  </div>
);

const Messages: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-6 w-full overflow-y-scroll h-screen">
      <div className="flex justify-between w-full text-b1">
        <p>Messages</p>
        <p>Count Type : #43</p>
      </div>

      {MsgDetails.map((msg, index) => (
        <MessageDetail
          key={index}
          msgType={msg.msgType}
          validator={msg.validator}
          amount={msg.amount}
          claimRewards={msg.claimRewards}
        />
      ))}
    </div>
  );
};

export default Messages;
