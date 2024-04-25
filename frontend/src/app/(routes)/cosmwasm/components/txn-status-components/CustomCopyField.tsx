import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { copyToClipboard } from '@/utils/copyToClipboard';
import Image from 'next/image';
import React from 'react';

const CustomCopyField = ({ name, value }: { name: string; value: string }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="txn-details-item">
      <div className="txn-details-item-title">{name}</div>
      <div className="truncate">
        <div className="w-full common-copy">
          <span className="truncate">{value || '-'}</span>
          <Image
            className="cursor-pointer"
            onClick={(e) => {
              copyToClipboard(value || '-');
              dispatch(
                setError({
                  type: 'success',
                  message: 'Copied',
                })
              );
              e.stopPropagation();
            }}
            src="/copy-icon-plain.svg"
            width={24}
            height={24}
            alt="copy"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomCopyField;
