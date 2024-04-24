import { TextField } from '@mui/material';
import React from 'react';
import { queryInputStyles } from '../styles';

interface ProvideFundsJsonI {
  fundsInput: string;
  setFundsInput: (value: string) => void;
}

const ProvideFundsJson = (props: ProvideFundsJsonI) => {
  const { fundsInput, setFundsInput } = props;
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="provide-funds-input-wrapper">
      <div className="provide-funds-input">
        <TextField
          value={fundsInput}
          onChange={handleFundsChange}
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
