import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { parseSendMsgsFromContent } from '@/utils/parseMsgs';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { multiSendInputFieldStyles } from '../../styles';
import {
  MULTIOPS_SAMPLE_FILES,
  MULTISEND_PLACEHOLDER,
} from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';

const AddMessages = ({
  chainID,
  addMsgs,
  msgs,
}: {
  chainID: string;
  addMsgs: (msgs: Msg[]) => void;
  msgs: Msg[];
}) => {
  const dispatch = useAppDispatch();
  const address = useAppSelector(
    (state) => state.wallet?.networks?.[chainID]?.walletInfo?.bech32Address
  );
  const [inputs, setInputs] = useState('');
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs(e.target.value);
  };

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

  return (
    <div>
      <div className="space-y-6">
        <div className="relative">
          <TextField
            multiline
            fullWidth
            className="text-[#fffffff0]"
            onChange={handleInputChange}
            value={inputs}
            spellCheck={false}
            rows={msgs.length ? 2 : 11}
            sx={{
              ...multiSendInputFieldStyles,
              ...{ height: msgs.length ? '90px' : '290px' },
            }}
            placeholder={MULTISEND_PLACEHOLDER}
            autoFocus={true}
          />
          <button
            onClick={() => addInputs()}
            type="button"
            className="primary-btn !px-6 absolute top-4 right-4 z-100"
          >
            Add
          </button>
        </div>
        <div
          className="upload-box"
          onClick={() => {
            const element = document.getElementById('multiTxns_file');
            if (element) element.click();
          }}
        >
          <div className="flex gap-1 items-center">
            <Image src="/icons/upload-icon.svg" height={24} width={24} alt="" />
            <div className="text-[14px]">Upload CSV here</div>
          </div>
          <div className="flex items-center gap-1">
            <div className="secondary-text">Download Sample</div>
            <Link
              href={MULTIOPS_SAMPLE_FILES.send}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[14px] underline underline-offset-[3px] font-bold"
            >
              here
            </Link>
          </div>
          <input
            id="multiTxns_file"
            accept=".csv"
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
                    message: '' + (e.target?.error || 'Something went wrong. '),
                  })
                );
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMessages;
