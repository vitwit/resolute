import Copy from '@/components/common/Copy';
import LetterAvatar from '@/components/common/LetterAvatar';
import { shortenAddress } from '@/utils/util';
import Link from 'next/link';
import React from 'react';

interface MultisigAccountCardProps {
  multisigAddress: string;
  threshold: number;
  name: string;
  actionsRequired: number;
  chainName: string;
}

const MultisigAccountCard = (props: MultisigAccountCardProps) => {
  const { actionsRequired, multisigAddress, chainName, name, threshold } =
    props;
  return (
    <Link
      href={`/multisig/${chainName.toLowerCase()}/${multisigAddress}`}
      className="multisig-card"
    >
      <MultisigName name={name} />
      <div className="flex items-center gap-6">
        <MultisigAddress address={multisigAddress} />
        <MultisigDetail title="Threshold" value={threshold} />
        <MultisigDetail title="Action Required" value={actionsRequired} />
      </div>
    </Link>
  );
};

export default MultisigAccountCard;

const MultisigName = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div>{name ? <LetterAvatar name={name} /> : null}</div>
      <div className="text-[14px]">{name}</div>
    </div>
  );
};

const MultisigAddress = ({ address }: { address: string }) => {
  return (
    <div className="space-y-2">
      <div className="text-small-light">Address</div>
      <div className="flex items-center">
        <div className="text-b1">{shortenAddress(address, 12)}</div>
        <Copy content={address} />
      </div>
    </div>
  );
};

const MultisigDetail = ({
  title,
  value,
  isAddress = false,
}: {
  title: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  value: any;
  isAddress?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <div className="text-small-light">{title}</div>
      <div className="flex items-center">
        <div className="text-b1">
          {isAddress ? shortenAddress(value, 15) : value}
        </div>
        {isAddress ? <Copy content={value} /> : null}
      </div>
    </div>
  );
};
