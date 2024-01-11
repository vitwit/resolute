import { copyToClipboard } from '@/utils/copyToClipboard';
import React from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

const CommonCopy = ({
  message,
  style,
  plainIcon,
}: {
  message: string;
  style: string;
  plainIcon?: boolean;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className={`${style} common-copy`}>
      <span className="truncate">{message}</span>
      <Image
        className="cursor-pointer"
        onClick={(e) => {
          copyToClipboard(message);
          dispatch(
            setError({
              type: 'success',
              message: 'Copied',
            })
          );
          e.stopPropagation();
        }}
        src={plainIcon ? '/copy-icon-plain.svg' : '/copy.svg'}
        width={24}
        height={24}
        alt="copy"
      />
    </div>
  );
};

export default CommonCopy;
