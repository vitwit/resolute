import { Autocomplete, Paper, TextField } from '@mui/material';
import React from 'react';
import {
  customAutoCompleteStyles,
  customTextFieldStyles,
} from '@/app/(routes)/transfers/styles';

const voteOptions: VoteOption[] = [
  {
    label: 'Yes',
    value: 1,
  },
  {
    label: 'No',
    value: 3,
  },
  {
    label: 'Abstain',
    value: 2,
  },
  {
    label: 'No With Veto',
    value: 4,
  },
];

const VoteOptionsList = ({
  selectedOption,
  handleChange,
}: {
  selectedOption: VoteOption | null;
  handleChange: (option: VoteOption | null) => void;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Vote"
      {...params}
      required
      sx={{
        '& .MuiInputBase-input': {
          color: 'white',
          fontSize: '14px',
          fontWeight: 300,
          fontFamily: 'Libre Franklin',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSvgIcon-root': {
          color: 'white',
        },
      }}
    />
  );

  return (
    <Autocomplete
      disablePortal
      fullWidth
      id="proposals-list"
      options={voteOptions}
      getOptionLabel={(option: VoteOption) => option.label}
      renderInput={renderInput}
      onChange={(_, newValue) => handleChange(newValue)}
      value={selectedOption}
      PaperComponent={({ children }) => (
        <Paper
          style={{
            background: '#FFFFFF14',
            color: 'white',
            borderRadius: '16px',
            backdropFilter: 'blur(15px)',
            marginTop: '8px',
          }}
        >
          {children}
        </Paper>
      )}
      sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
    />
  );
};
export default VoteOptionsList;
