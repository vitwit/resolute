import { TextField } from '@mui/material';
import React from 'react';
import { queryInputStyles } from '../styles';
import { useAppDispatch } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';

interface ProvideFundsJsonI {
  fundsInput: string;
  setFundsInput: (value: string) => void;
}

const ProvideFundsJson = (props: ProvideFundsJsonI) => {
  const { fundsInput, setFundsInput } = props;
  const dispatch = useAppDispatch();
  const handleFundsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFundsInput(e.target.value);
  };
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(fundsInput);
      const formattedJSON = JSON.stringify(parsed, undefined, 4);
      setFundsInput(formattedJSON);
      return;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      dispatch(
        setError({
          type: 'error',
          message:
            'Invalid JSON input: (Attach Funds) ' + (error?.message || ''),
        })
      );
    }
  };

  return (
    <div className="provide-funds-input-wrapper">
      <div className="provide-funds-input">
        <TextField
          value={fundsInput}
          onChange={handleFundsChange}
          placeholder={JSON.stringify(
            [{ amount: '100000', denom: 'uosmo' }],
            undefined,
            2
          )}
          fullWidth
          multiline
          rows={7}
          InputProps={{
            sx: {
              input: {
                color: 'white',
                fontSize: '14px',
                padding: 2,
              },
            },
          }}
          sx={queryInputStyles}
        />
        <button type="button" onClick={formatJSON} className="format-json-btn">
          Format JSON
        </button>
      </div>
    </div>
  );
};

export default ProvideFundsJson;
