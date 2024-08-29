import React from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/common/CustomButton';

type Status = 'success' | 'failed';

interface TransactionHeaderProps {
  status: Status;
  hash: string;
  onRepeatTxn: () => void;
  disableAction: boolean;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  status,
  hash,
  disableAction,
  onRepeatTxn,
}) => {
  const router = useRouter();
  const isSuccess = status === 'success';
  const textColorClass = isSuccess ? 'text-[#2BA472]' : 'text-[#FA5E42]';

  return (
    <div className="flex flex-col py-10 gap-10">
      <div className="flex flex-col gap-6">
        <div className="secondary-btn" onClick={() => router.back()}>
          Go back
        </div>
        <div className="flex justify-between items-end gap-6">
          <div className="flex gap-1 flex-col w-full">
            <div className="flex gap-1 items-center">
              <Image
                src={isSuccess ? '/success-icon.svg' : '/failed-icon.svg'}
                width={32}
                height={32}
                alt={isSuccess ? 'success-icon' : 'failed-icon'}
              />
              <div className={`text-[20px] font-bold ${textColorClass}`}>
                {isSuccess ? 'Transaction Successful' : 'Transaction Failed'}
              </div>
            </div>
            {!isSuccess && <div className="text-b1-light"></div>}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <div className="text-b1-light">{hash}</div>
                <Copy content={hash} />
              </div>
              <div className="divider-line"></div>
            </div>
          </div>
          <CustomButton
            btnText={isSuccess ? 'Repeat Transaction' : 'Retry Transaction'}
            btnDisabled={disableAction}
            btnOnClick={onRepeatTxn}
            btnStyles={`w-[20%] ${disableAction ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
