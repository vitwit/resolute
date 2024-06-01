/**
 * Copy component displays an icon that allows the user to copy content to the clipboard.
 * @module Copy
 */

import { copyToClipboard } from '@/utils/copyToClipboard';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

/**
 * Copy component displays an icon that allows the user to copy content to the clipboard.
 * @param {Object} props - The props object.
 * @param {string} props.content - The content to be copied to the clipboard.
 * @returns {React.ReactNode} - React element representing the Copy component.
 */

const Copy = ({
  content,
  height = 20,
  width = 20,
}: {
  content: string;
  height?: number;
  width?: number;
}) => {
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
          src={'/icons/copy-icon.svg'}
          width={width}
          height={height}
          alt="copy"
        />
      </Tooltip>
    </div>
  );
};

export default Copy;
