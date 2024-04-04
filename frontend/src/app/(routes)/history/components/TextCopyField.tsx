import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { shortenAddress, shortenName } from '@/utils/util';
import Image from 'next/image';
import React from 'react';

const TextCopyField = ({
  displayLen,
  isAddress,
  content,
}: {
  displayLen: number;
  isAddress: boolean;
  content: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="bg-[#FFFFFF14] rounded-full h-[36px] text-[14px] px-3 py-2 flex-center-center gap-2">
      <span>
        {isAddress
          ? shortenAddress(content, displayLen)
          : shortenName(content, displayLen)}
      </span>
      <Image
        className="cursor-pointer"
        src="/copy-icon-plain.svg"
        height={24}
        width={24}
        alt="Copy"
        onClick={(e) => {
          copyToClipboard(content);
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
  );
};

export default TextCopyField;
