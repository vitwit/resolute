import React, { useState } from 'react';
import Image from 'next/image';

const UploadWasmLeft: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && file.name.endsWith('.wasm')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a correct .wasm file format');
    }
  };

  return (
    <div className="w-[50%] justify-center upload-box-cosmwasm">
      <label className="flex gap-2 items-center cursor-pointer">
        <Image
          src="/icons/upload-icon.svg"
          height={24}
          width={24}
          alt="Upload Icon"
        />
        <div className="text-b1">Upload (WASM) file here</div>
        <input
          type="file"
          accept=".wasm"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      {selectedFile && (
        <div className="mt-2 text-sm text-gray-600">
          Selected file: {selectedFile.name}
        </div>
      )}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default UploadWasmLeft;
