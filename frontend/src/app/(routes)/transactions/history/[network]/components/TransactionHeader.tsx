import React from 'react';
import Image from 'next/image';
import Copy from '@/components/common/Copy';
import CustomButton from '@/components/common/CustomButton';
import Link from 'next/link';
import { REDIRECT_ICON } from '@/constants/image-names';

type Status = 'success' | 'failed';

interface TransactionHeaderProps {
  status: Status;
  hash: string;
  onRepeatTxn: () => void;
  disableAction: boolean;
  goBackUrl: string;
  isSearchPage?: boolean;
  mintscanURL: string;
  rawLog?: string;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  status,
  hash,
  disableAction,
  onRepeatTxn,
  goBackUrl,
  isSearchPage,
  mintscanURL,
  rawLog
}) => {
  const isSuccess = status === 'success';
  const textColorClass = isSuccess ? 'text-[#2BA472]' : 'text-[#FA5E42]';

  return (
    <div className="flex flex-col py-10 gap-10">
      <div className="flex flex-col gap-6">
        {isSearchPage ? null : (
          <Link href={goBackUrl} className="secondary-btn w-fit">
            Go back
          </Link>
        )}
        <div>
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
          {
            !isSuccess && <div className='w-full'>
              <div className={`text-[15px] text-opacity-75 ${textColorClass}`}>
                {isSuccess ? null : rawLog}
              </div>
              <br/>
            </div> || null
          }
          <div className="flex justify-between items-end gap-6">
            <div className="flex gap-1 flex-col flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <div className="text-b1-light">{hash}</div>
                  <Copy content={hash} />
                </div>
                <div className="divider-line"></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {isSearchPage ? null : (
                <CustomButton
                  btnText={isSuccess ? 'Repeat Transaction' : 'Retry Transaction'}
                  btnDisabled={disableAction}
                  btnOnClick={onRepeatTxn}
                  btnStyles={`${disableAction ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              )}
              {mintscanURL ? (
                <Link
                  className="flex items-end gap-1"
                  href={mintscanURL}
                  target="_blank"
                >
                  <div className="secondary-btn">View on Mintscan</div>
                  <Image
                    src={REDIRECT_ICON}
                    width={18}
                    height={18}
                    alt="View Proposal"
                    className="cursor-pointer"
                    draggable={false}
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransactionHeader;
