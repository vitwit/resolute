import React, { useEffect, useState } from 'react';
import UploadWasmLeft from './UploadWasmLeft';
import UploadWasmRight from './UploadWasmRight';
import { SelectChangeEvent } from '@mui/material';

const UploadWasmFile = () => {
  const [attachFundType, setAttachFundType] = useState<string>('everyone');

  const handleAttachFundTypeChange = (event: SelectChangeEvent<string>) => {
    console.log("attachFundType is THREE",event.target.value);
    
    setAttachFundType(event.target.value);
  };

  useEffect(()=>{
    console.log("attachFundType is ONE",attachFundType);
    
  },[attachFundType])

  return (
    <div className="min-h-[calc(100vh-325px)] flex flex-col gap-10 justify-between">
      <div className="flex gap-10">
        <UploadWasmLeft />

        <UploadWasmRight
          attachFundType={attachFundType}
          handleAttachFundTypeChange={handleAttachFundTypeChange}
        />
      </div>
      <button className="primary-btn w-full">Upload Contract</button>
    </div>
  );
};

export default UploadWasmFile;
