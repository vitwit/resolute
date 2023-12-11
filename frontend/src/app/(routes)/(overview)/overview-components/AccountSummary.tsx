import { CopyToClipboard } from '@/components/CopyToClipboard';
import useGetAccountInfo from '@/custom-hooks/useGetAccountInfo';
import { shortenMsg } from '@/utils/util';
import Image from 'next/image';
import React from 'react';
type AssetSummary = {
  icon: string;
  alt: string;
  type: string;
  value: string | React.JSX.Element;
};

const AccountSummery = ({ chainID }: { chainID: string }) => {
  const [chainInfo] = useGetAccountInfo(chainID);
  const { pubkey, sequence, accountNumber } = chainInfo;
  const assetsSummaryData: AssetSummary[] = [
    {
      icon: '/key.svg',
      alt: 'public-key',
      type: 'Public Key',
      value: (
        <CopyToClipboard
          message={pubkey}
          formattedMessage={shortenMsg(pubkey, 15)}
        />
      ),
    },
    {
      icon: '/avatar.svg',
      alt: 'sequence',
      type: 'Sequence',
      value: sequence,
    },
    {
      icon: '/drag-indicator.svg',
      alt: 'account-number',
      type: 'Account Number',
      value: accountNumber,
    },
  ];

  return (
    <div className="w-full summary-cards-container">
      {assetsSummaryData.map((assetTypeData) => (
        <AccountSummaryCard
          key={assetTypeData.type}
          icon={assetTypeData.icon}
          alt={assetTypeData.alt}
          value={assetTypeData.value}
          type={assetTypeData.type}
        />
      ))}
    </div>
  );
};

const AccountSummaryCard = (props: AssetSummary) => {
  const { type, icon, value, alt } = props;
  return (
    <div className="summary-card">
      <div className="flex w-full h-10">
        <div className="flex items-center justify-center">
          <Image src={icon} width={40} height={40} alt={alt}></Image>
        </div>
        <div className="flex items-center">
          <div className="text-sm not-italic font-normal leading-[normal]">
            {type}
          </div>
        </div>
      </div>
      <div className="ml-2 text-white text-2xl font-bold leading-[normal]">
        {value}
      </div>
    </div>
  );
};

export default AccountSummery;
