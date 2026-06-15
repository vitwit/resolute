import { copyToClipboard } from '@/utils/copyToClipboard';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const ShareTxn = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    copyToClipboard(content);
    setCopied(true);
    e.stopPropagation();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div>
      <Tooltip title="Copied!" placement="right" open={copied}>
        <Image
          className="cursor-pointer"
          onClick={handleCopy}
          src={'/icons/share-icon.svg'}
          width={32}
          height={32}
          alt="copy"
        />
      </Tooltip>
    </div>
  );
};

export default ShareTxn;
