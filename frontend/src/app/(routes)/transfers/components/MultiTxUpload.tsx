import Image from 'next/image';
import { parseSendMsgsFromContent } from '@/utils/parseMsgs';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { MULTISEND_PLACEHOLDER, SEND_TEMPLATE } from '@/utils/constants';
import { ChangeEvent, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { multiSendInputFieldStyles } from '../styles';

const MultiTxUpload = ({
  chainID,
  addMsgs,
}: {
  chainID: string;
  addMsgs: (msgs: Msg[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const address = useAppSelector(
    (state) => state.wallet.networks[chainID].walletInfo.bech32Address
  );

  const onFileContents = (content: string | ArrayBuffer | null) => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      '\n' + content
    );
    if (error) {
      dispatch(
        setError({
          type: 'error',
          message: error,
        })
      );
    } else {
      addMsgs(parsedTxns);
    }
  };

  const [isFileUpload, setIsFileUpload] = useState(true);
  const [inputs, setInputs] = useState('');
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs(e.target.value);
  };

  const addInputs = () => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      '\n' + inputs
    );
    if (error) {
      dispatch(
        setError({
          type: 'error',
          message: error,
        })
      );
    } else {
      addMsgs(parsedTxns);
      if (parsedTxns?.length) {
        setInputs('');
      } else {
        dispatch(
          setError({
            type: 'error',
            message: 'Invalid input',
          })
        );
      }
    }
  };

  const handleToggle = (value: boolean) => {
    addMsgs([]);
    setIsFileUpload(value);
  };

  const getInputRowsCountWithScreenSize = () => {
    const divElement = document.getElementById('multisend-inputs');
    const height = divElement?.offsetHeight || 500;
    const rows = Math.min((height - 46) / 23, 18);
    return parseInt(rows.toString());
  };

  const [inputRows, setInputRows] = useState(getInputRowsCountWithScreenSize());

  const resetInputsRowsCount = () => {
    setInputRows(getInputRowsCountWithScreenSize());
  };

  useEffect(() => {
    window.addEventListener('resize', resetInputsRowsCount);
    return () => {
      window.removeEventListener('resize', resetInputsRowsCount);
    };
  }, []);

  useEffect(() => {
    if (!isFileUpload) {
      resetInputsRowsCount();
    }
  }, [isFileUpload]);

  return (
    <div className="space-y-6 flex flex-col flex-1">
      <div className="w-full flex justify-between items-center">
        <ButtonGroup isFileUpload={isFileUpload} handleToggle={handleToggle} />
        <div className="flex items-center">
          <div className="text-right text-xs not-italic font-normal leading-[normal]">
            Download Sample{' '}
          </div>
          <div className="w-6 h-6 flex items-center justify-center cursor-pointer">
            <Image
              src="/download-icon.svg"
              width={24}
              height={24}
              alt="Download"
              onClick={() => {
                window.open(SEND_TEMPLATE, '_blank', 'noopener,noreferrer');
              }}
            />
          </div>
        </div>
      </div>
      {isFileUpload ? (
        <div
          className="file-upload-box flex flex-col flex-1"
          style={{
            backgroundColor: '#1a1731',
            height: '228px',
          }}
          onClick={() => {
            const element = document.getElementById('multiTxns_file');
            if (element) element.click();
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <Image
                src="/file-upload-icon.svg"
                width={48}
                height={48}
                alt="Upload file"
              />
              <div className="mt-2 mx-12 text-center text-xs not-italic font-normal leading-5">
                Upload CSV File, Each line must contain “Recipient Amount”
              </div>
              <div />
            </div>
            <input
              id="multiTxns_file"
              accept="*.csv"
              hidden
              type="file"
              onChange={(e) => {
                if (!e?.target?.files) return;
                const file = e.target.files[0];
                if (!file) {
                  return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                  if (!e.target) return null;
                  const contents = e.target.result;
                  onFileContents(contents);
                };
                reader.onerror = (e) => {
                  dispatch(
                    setError({
                      type: 'error',
                      message:
                        '' + (e.target?.error || 'Something went wrong. '),
                    })
                  );
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="multisend-input-box flex flex-col flex-1 gap-2"
          style={{
            backgroundColor: '#1a1731',
            height: '228px',
            justifyContent: 'space-between',
          }}
          onClick={() => {
            const element = document.getElementById('multiTxns_file');
            if (element) element.click();
          }}
        >
          <div
            id="multisend-inputs"
            className="w-full h-full overflow-y-scroll"
          >
            <TextField
              multiline
              fullWidth
              className="text-white"
              onChange={handleInputChange}
              value={inputs}
              spellCheck={false}
              rows={inputRows}
              sx={multiSendInputFieldStyles}
              placeholder={MULTISEND_PLACEHOLDER}
              autoFocus={true}
            />
          </div>
          <button
            onClick={addInputs}
            type="button"
            className="primary-gradient w-full py-1 rounded-lg"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiTxUpload;

const ButtonGroup = ({
  handleToggle,
  isFileUpload,
}: {
  isFileUpload: boolean;
  handleToggle: (value: boolean) => void;
}) => {
  return (
    <div className="multisend-toggle-btn-group">
      <button
        onClick={() => handleToggle(true)}
        type="button"
        className={`multisend-btn ${isFileUpload ? 'multisend-btn-active' : ''} `}
      >
        Upload File
      </button>
      <button
        onClick={() => handleToggle(false)}
        type="button"
        className={`multisend-btn ${!isFileUpload ? 'multisend-btn-active' : ''} `}
      >
        Enter Manually
      </button>
    </div>
  );
};
