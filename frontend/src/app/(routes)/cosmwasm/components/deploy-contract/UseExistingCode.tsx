import React from 'react';

import UploadWasmLeft from './UploadWasmLeft';
import UploadWasmRight from './UploadWasmRight';
import UseExistingCodeLeft from './UseExisitingCodeLeft';
import UseExistingCodeRight from './UseExistingCodeRight';

const UseExistingCode = () => {
  return (
    <div className="min-h-[calc(100vh-325px)] flex flex-col gap-10 justify-between">
      <div className="flex gap-10">
        <UseExistingCodeLeft chainID={''} chainName={''} />
        <UseExistingCodeRight msgs={[]} />
      </div>
      <div className="flex gap-10">
        <UploadWasmLeft />
        <UploadWasmRight />
      </div>

      <button className="primary-btn w-full">Instantiate</button>
    </div>
  );
};

export default UseExistingCode;
