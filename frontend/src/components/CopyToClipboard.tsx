import { Chip } from '@mui/material';
import React from 'react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import Image from 'next/image';

export const CopyToClipboard = ({
  message,
  formattedMessage,
}: {
  message: string;
  formattedMessage: string;
}) => {
  return (
    <Chip
      className="text-white text-2xl font-bold leading-[normal]"
      label={formattedMessage}
      size="small"
      deleteIcon={
        <Image src="/copy.svg" height={24} width={24} alt="copy-content" />
      }
      onDelete={() => {
        copyToClipboard(message);
      }}
    />
  );
};
