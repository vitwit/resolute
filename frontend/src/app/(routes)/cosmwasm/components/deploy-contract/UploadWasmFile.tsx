import React from 'react';
import UploadWasmLeft from './UploadWasmLeft';
import UploadWasmRight from './UploadWasmRight';

const UploadWasmFile = () => {
  return (
    <div className="min-h-[calc(100vh-325px)] flex flex-col gap-10 justify-between">
      <div className="flex gap-10">
        <UploadWasmLeft />

        <UploadWasmRight />
      </div>
      <button className="primary-btn w-full">Upload Contract</button>
    </div>
  );
};

export default UploadWasmFile;
