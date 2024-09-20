import { shortenAddress, shortenMsg } from '@/utils/util';
import Link from 'next/link';
import React from 'react';
import PermissionsData from './PermissionsData';
import Copy from '@/components/common/Copy';
import Image from 'next/image';

const CodeItem = ({
  code,
  chainLogo,
}: {
  code: CodeInfo;
  chainLogo: string;
}) => {
  return (
    <div className="contract-card">
      <div className="flex flex-col gap-2 w-[10%]">
        <p className="secondary-text">Code ID</p>
        <p className="text-b1">{code.code_id}</p>
      </div>
      <div className="flex flex-col gap-2 w-[30%]">
        <p className="secondary-text">Code Hash</p>
        <div className="flex">
          <p className="text-b1 underline">
            <Link href={`?tab=codes&code_id=${code.code_id}`} prefetch={false}>
              {shortenMsg(code.data_hash, 25)}
            </Link>
          </p>
          <Copy content={code.data_hash} />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[30%]">
        <p className="secondary-text">Creator</p>
        <div className="flex items-center gap-1">
          <Image
            src={chainLogo}
            width={16}
            height={16}
            alt="network-logo"
            className="w-4 h-4"
          />
          <p className="text-b1">{shortenAddress(code.creator, 20)}</p>
          <Copy content={code.creator} />
        </div>
      </div>

      <PermissionsData permission={code.instantiate_permission} />
    </div>
  );
};

export default CodeItem;
