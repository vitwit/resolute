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
import * as XLSX from 'xlsx';

interface FileUploadProps {
  fromAddress: string;
  msgType: string;
  onUpload: (msgs: Msg[]) => void;
  onCancel: () => void;
  msgsCount: number;
}

const FileUpload = (props: FileUploadProps) => {
  const { fromAddress, msgType, onUpload, onCancel, msgsCount } = props;

  const dispatch = useAppDispatch();

  const parseExcel = (content: ArrayBuffer) => {
    const workbook = XLSX.read(content, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_csv(sheet);
  };

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
          dispatch(setError({ type: 'success', message: 'File uploaded' }));
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
          dispatch(setError({ type: 'success', message: 'File uploaded' }));
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
          dispatch(setError({ type: 'success', message: 'File uploaded' }));
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
          dispatch(setError({ type: 'success', message: 'File uploaded' }));
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
          dispatch(setError({ type: 'success', message: 'File uploaded' }));
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
          {msgsCount > 0 ? (
            <div className="flex items-center justify-between w-full">
              <div className="text-[12px]">
                You are adding{' '}
                <span className="font-bold">{msgsCount} messages</span> to this
                transaction
              </div>
              <button
                onClick={(e) => {
                  onCancel();
                  e.stopPropagation();
                }}
                className="secondary-btn"
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={UPLOAD_ICON}
                  height={32}
                  width={32}
                  alt=""
                  className="opacity-50"
                />
                <div className="secondary-text">Upload CSV or Excel here</div>
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
            </div>
          )}
        </div>
        <input
          id="multiops_file"
          accept=".csv,.xlsx,.xls"
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

            try {
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const contents = e?.target?.result;
                  if (
                    file.type ===
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.type === 'application/vnd.ms-excel'
                  ) {
                    const parsedContent = parseExcel(contents as ArrayBuffer);
                    onFileContents(parsedContent, msgType);
                  } else {
                    const decoder = new TextDecoder('utf-8');
                    const decodedContent = decoder.decode(
                      contents as ArrayBuffer
                    );
                    onFileContents(decodedContent, msgType);
                  }
                } catch (_) {
                  dispatch(
                    setError({
                      type: 'error',
                      message: 'Error while parsing file contents',
                    })
                  );
                }
              };
              reader.onerror = (e) => {
                console.log('Error reading the file', e);
                dispatch(
                  setError({
                    type: 'error',
                    message: 'Error reading the file.',
                  })
                );
              };
              reader.readAsArrayBuffer(file);
            } catch (error) {
              dispatch(
                setError({
                  type: 'error',
                  message: 'Error while uploading file',
                })
              );
            }
            e.target.value = '';
          }}
        />
      </div>
    </>
  );
};

export default FileUpload;
