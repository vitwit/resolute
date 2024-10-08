import {
  MINUS_ICON,
  MINUS_ICON_DISABLED,
  PLUS_ICON,
  PLUS_ICON_DISABLED,
} from '@/constants/image-names';
import { DECREASE, INCREASE } from '@/utils/constants';
import Image from 'next/image';
import React from 'react';

const Threshold = ({
  handleThresholdChange,
  threshold,
  membersCount,
  isImportMultisig,
}: {
  handleThresholdChange: (value: string) => void;
  threshold: number;
  membersCount: number;
  isImportMultisig: boolean;
}) => {
  const incDisabled = threshold >= membersCount;
  const decDisabled = threshold <= 1;
  return (
    <div className="threshold">
      <button
        disabled={decDisabled || isImportMultisig}
        onClick={() => handleThresholdChange(DECREASE)}
        type="button"
      >
        <Image
          src={
            decDisabled || isImportMultisig ? MINUS_ICON_DISABLED : MINUS_ICON
          }
          height={20}
          width={20}
          alt="Decrease"
        />
      </button>
      <div className="w-5 h-5 flex-center">{threshold}</div>
      <button
        disabled={incDisabled || isImportMultisig}
        onClick={() => handleThresholdChange(INCREASE)}
        type="button"
      >
        <Image
          src={incDisabled || isImportMultisig ? PLUS_ICON_DISABLED : PLUS_ICON}
          height={20}
          width={20}
          alt="Increase"
        />
      </button>
    </div>
  );
};

export default Threshold;
