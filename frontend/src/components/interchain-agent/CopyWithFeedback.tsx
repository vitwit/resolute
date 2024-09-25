import Image from 'next/image';
import React, { useState } from 'react';

const CopyWithFeedback = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleCopy}
        className="h-6 w-6 rounded-full hover:bg-[#ffffff29] flex items-center justify-center"
      >
        <Image
          src="/interchain-agent/copy-icon.svg"
          height={20}
          width={20}
          alt=""
        />
      </button>
      {copied ? (
        <div className="text-[12px] text-[#ffffff80]">Copied!</div>
      ) : null}
    </div>
  );
};

export default CopyWithFeedback;
