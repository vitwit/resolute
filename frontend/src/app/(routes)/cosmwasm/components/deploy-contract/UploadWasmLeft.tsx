import React from 'react';
import Image from 'next/image';

const UploadWasmLeft = () => {
  return (
    <div className="w-[50%] justify-center upload-box">
      <div className="flex gap-2 items-center">
        <Image src="/icons/upload-icon.svg" height={24} width={24} alt="" />
        <div className="text-b1">Upload (WASM) file here</div>
      </div>
    </div>
  );
};

export default UploadWasmLeft;
