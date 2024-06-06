'use client';
import Image from 'next/image';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { getLocalTime, getTimeDifference } from '@/utils/dataTime';

const TxnDetails = [
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnSuccess',
  },
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnFailed',
  },
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnSuccess',
  },
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnSuccess',
  },
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnFailed',
  },
  {
    fromAddress: '9EE7829FA411244...',
    time: '23rd March 2024, 11:30 pm',
    sent: '1000 AKT',
    toAddress: 'pasg1h3v5dv7',
    status: 'txnSuccess',
  },
];

const TxnView = ({timeStamp}: {
  timeStamp: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div>
      {TxnDetails.map((txn, index) => (
        <div key={index} className="flex items-start gap-2 mb-6">
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              src={txn.status === 'txnSuccess' ? '/tick.png' : '/fail.png'}
              width={24}
              height={24}
              alt={txn.status === 'txnSuccess' ? 'Txn-Passed' : 'Txn-Failed'}
            />
            <div className="vertical-divider h-[72px]"></div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2.5 px-2 py-0.5">
              <div className="flex">
                <p className="text-b1">{txn.fromAddress}</p>

                <Image
                  className="cursor-pointer"
                  src="/copy.svg"
                  height={24}
                  width={24}
                  alt="Copy"
                  onClick={(e) => {
                    copyToClipboard(txn.fromAddress);
                    dispatch(
                      setError({
                        type: 'success',
                        message: 'Copied',
                      })
                    );
                    e.stopPropagation();
                  }}
                />
              </div>
              <p className="text-small-light">
                {' '}
                {getTimeDifference(timeStamp)} | {getLocalTime(timeStamp)}
              </p>
            </div>
            <div className="txn-grid justify-between w-full">
              <div className="flex gap-1">
                <p className="secondary-text">Sent</p>{' '}
                <p className="text-b1">{txn.sent}</p>{' '}
                <p className="secondary-text">to</p>
                <p className="text-b1"> {txn.toAddress}</p>
                <Image
                  className="cursor-pointer"
                  src="/copy.svg"
                  height={24}
                  width={24}
                  alt="Copy"
                  onClick={(e) => {
                    copyToClipboard(txn.toAddress);
                    dispatch(
                      setError({
                        type: 'success',
                        message: 'Copied',
                      })
                    );
                    e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex gap-2">
                <p className="txn-type-chip text-b1">Send</p>
                <p className="txn-type-chip text-b1">Delegate</p>
                <p className="txn-type-chip text-b1">Vote</p>
                <p className="more-chip text-b1">+3</p>
              </div>
              <button className="primary-btn w-20">
                {txn.status === 'txnFailed' ? 'Retry' : 'Repeat'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TxnView;
