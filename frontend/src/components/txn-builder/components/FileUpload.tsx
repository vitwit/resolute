import { UPLOAD_ICON } from '@/constants/image-names';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { MULTIOPS_MSG_TYPES, MULTIOPS_SAMPLE_FILES } from '@/utils/constants';
import {
  parseDelegateMsgsFromContent,
  parseReDelegateMsgsFromContent,
  parseSendMsgsFromContent,
  parseUnDelegateMsgsFromContent,
  parseVoteMsgsFromContent,
} from '@/utils/parseMsgs';
import Image from 'next/image';
import React from 'react';

interface FileUploadProps {
  fromAddress: string;
  msgType: string;
  onUpload: (msgs: Msg[]) => void;
}

const FileUpload = (props: FileUploadProps) => {
  const { fromAddress, msgType, onUpload } = props;

  const dispatch = useAppDispatch();
  const onFileContents = (content: string, type: string) => {
    switch (type) {
      case MULTIOPS_MSG_TYPES.send: {
        const [parsedTxns, error] = parseSendMsgsFromContent(
          fromAddress,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          onUpload(parsedTxns);
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.delegate: {
        const [parsedTxns, error] = parseDelegateMsgsFromContent(
          fromAddress,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          onUpload(parsedTxns);
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.redelegate: {
        const [parsedTxns, error] = parseReDelegateMsgsFromContent(
          fromAddress,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          onUpload(parsedTxns);
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.undelegate: {
        const [parsedTxns, error] = parseUnDelegateMsgsFromContent(
          fromAddress,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          onUpload(parsedTxns);
        }
        break;
      }
      case MULTIOPS_MSG_TYPES.vote: {
        const [parsedTxns, error] = parseVoteMsgsFromContent(
          fromAddress,
          content
        );
        if (error) {
          dispatch(
            setError({
              type: 'error',
              message: error,
            })
          );
        } else {
          onUpload(parsedTxns);
        }
        break;
      }
      default:
        onUpload([]);
    }
  };
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="divider-line"></div>
        <div className="secondary-text !font-light">and/or</div>
        <div className="divider-line"></div>
      </div>
      <div className="space-y-2">
        <div
          className="upload-box"
          onClick={() => {
            document.getElementById('multiops_file')!.click();
          }}
        >
          <Image
            src={UPLOAD_ICON}
            height={32}
            width={32}
            alt=""
            className="opacity-50"
          />
          <div className="secondary-text">Upload CSV here</div>
        </div>
        <div className="flex items-center justify-end gap-1 h-6 text-[12px]">
          <div className="secondary-text !text-[12px] !font-light">
            Download Sample
          </div>
          <button
            type="button"
            onClick={() => {
              window.open(
                MULTIOPS_SAMPLE_FILES?.[msgType.toLowerCase()],
                '_blank',
                'noopener,noreferrer'
              );
            }}
            className="underline underline-offset-[3px] font-bold"
          >
            here
          </button>
        </div>
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
              onFileContents(contents, msgType);
            };
            reader.onerror = (e) => {
              alert(e);
            };
            reader.readAsText(file);
            e.target.value = '';
          }}
        />
      </div>
    </>
  );
};

export default FileUpload;
