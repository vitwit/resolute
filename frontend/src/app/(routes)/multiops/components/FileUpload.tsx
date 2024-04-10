import { IconButton } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { MULTIOPS_MSG_TYPES, MULTIOPS_SAMPLE_FILES } from '@/utils/constants';

interface FileUploadProps {
  onFileContents: (content: string, type: string) => boolean;
  msgType: string;
  resetMessages: () => void;
  messagesCount: number;
}

const FileUpload = (props: FileUploadProps) => {
  const { onFileContents, resetMessages, msgType, messagesCount } = props;
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!messagesCount) {
      setUploadedFiles([]);
    }
  }, [messagesCount]);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="self-end">
        <div className="mt-2 text-[14px] leading-normal font-light flex items-center">
          <div
            className="add-network-json-sample-link flex gap-2"
            onClick={() => {
              switch (msgType) {
                case MULTIOPS_MSG_TYPES.send:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.send,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                case MULTIOPS_MSG_TYPES.delegate:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.delegate,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                case MULTIOPS_MSG_TYPES.undelegate:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.undelegate,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                case MULTIOPS_MSG_TYPES.redelegate:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.redelegate,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                case MULTIOPS_MSG_TYPES.vote:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.vote,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                case MULTIOPS_MSG_TYPES.deposit:
                  window.open(
                    MULTIOPS_SAMPLE_FILES.deposit,
                    '_blank',
                    'noopener,noreferrer'
                  );
                  break;
                default:
                  alert('unknown message type');
              }
            }}
          >
            <div>Download sample CSV file</div>
            <Image
              src="/download-icon.svg"
              height={24}
              width={24}
              alt="download"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div
        className="flex-1 bg-[#ffffff0D] rounded-lg flex-center-center cursor-pointer relative"
        onClick={() => {
          document.getElementById('multiops_file')!.click();
        }}
      >
        {uploadedFiles.length ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {uploadedFiles?.map((file) => (
                <div key={file} className="italic">
                  {file}{' '}
                </div>
              ))}
            </div>
            <div
              onClick={(e) => {
                setUploadedFiles([]);
                resetMessages();
                e.stopPropagation();
              }}
              className="flex gap-2 items-center"
            >
              <div className="underline opacity-50 font-light">
                Clear uploads
              </div>
              <IconButton aria-label="delete txn" color="error">
                <ClearIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <>
            <Image
              src="/file-upload-icon.svg"
              width={24}
              height={24}
              alt="Upload file"
              draggable={false}
            />
            <div className="mt-2">Upload file here</div>
          </>
        )}
        <input
          id="multiops_file"
          accept=".csv"
          hidden
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files) {
              return;
            }
            const file = files[0];
            if (!file) {
              return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const contents = (e?.target?.result as string) || '';
              const isValid = onFileContents(contents, msgType);
              if (isValid) {
                setUploadedFiles((prev) => [...prev, file?.name]);
              }
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
        {uploadedFiles.length ? (
          <div className="absolute bottom-4 opacity-50 font-light px-6">
            Click anywhere in the box to upload one more file
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FileUpload;
