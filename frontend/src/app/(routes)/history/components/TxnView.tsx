import Image from 'next/image';

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

const TxnView = () => {
  return (
    <div>
      {TxnDetails.map((txn, index) => (
        <div key={index} className="flex items-start gap-2 mb-4">
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
                <Image src="/copy.svg" width={24} height={24} alt="Copy-icon" />
              </div>
              <p className="text-small-light">{txn.time}</p>
            </div>
            <div className="txn-grid justify-between w-full">
              <div className="flex gap-1">
                <p className="secondary-text">Sent</p>{' '}
                <p className="text-b1">{txn.sent}</p>{' '}
                <p className="secondary-text">to</p>
                <p className="text-b1"> {txn.toAddress}</p>
                <Image
                  src="/copy.svg"
                  width={24}
                  height={24}
                  alt="copy.svg"
                  className="cursor-pointer"
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
