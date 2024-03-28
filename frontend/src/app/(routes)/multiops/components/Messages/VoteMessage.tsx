import Image from 'next/image';
import React from 'react';

interface VoteMessageProps {
  msg: Msg;
  onDelete: (index: number) => void;
  index: number;
}

const voteOptions: Record<string, string> = {
  '1': 'Yes',
  '2': 'Abstain',
  '3': 'No',
  '4': 'No With Veto',
};

const VoteMessage: React.FC<VoteMessageProps> = (props) => {
  const { msg, index, onDelete } = props;
  return (
    <div className="flex justify-between items-center text-[14px]">
      <div className="flex gap-2">
        <Image
          className="bg-[#FFFFFF1A] rounded-lg"
          src="/solid-arrow-icon.svg"
          height={24}
          width={24}
          alt={index.toString()}
          draggable={false}
        />
        <div className="truncate max-w-[280px]">
          <span>Vote&nbsp;</span>
          <span className="msg-amount">
            {voteOptions?.[msg.value.option.toString()]}
          </span>
          <span>&nbsp;on&nbsp;</span>
          <span className="font-extralight">proposal&nbsp;</span>
          <span>#{msg.value.proposalId}</span>
        </div>
      </div>
      {onDelete ? (
        <span className="cursor-pointer" onClick={() => onDelete(index)}>
          <Image
            src="/delete-cross-icon.svg"
            height={16}
            width={16}
            alt="Remove"
            draggable={false}
          />
        </span>
      ) : null}
    </div>
  );
};

export default VoteMessage;
