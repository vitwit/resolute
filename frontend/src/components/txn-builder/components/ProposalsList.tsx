import {
  customAutoCompleteStyles,
  customTextFieldStyles,
} from '@/app/(routes)/transfers/styles';
import { shortenName } from '@/utils/util';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material';
import React from 'react';

const ProposalsList = ({
  options,
  selectedOption,
  handleChange,
  dataLoading,
}: {
  options: ProposalOption[];
  selectedOption: ProposalOption | null;
  handleChange: (option: ProposalOption | null) => void;
  dataLoading: boolean;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderOption = (props: any, option: ProposalOption) => (
    <li {...props} key={option.value}>
    <div className="flex gap-2 items-center">
      <span className="font-semibold">#{option.value}</span>
      <span className="truncate">{shortenName(option.label, 36)}</span>
    </div>
  </li>
  );

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renderInput = (params: any) => (
    <TextField
      placeholder="Select Proposal"
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
      options={options}
      getOptionLabel={(option: ProposalOption) => option.label}
      renderOption={renderOption}
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
          {dataLoading ? (
            <div className="flex justify-center items-center p-4">
              <CircularProgress color="inherit" size={20} />
            </div>
          ) : (
            children
          )}
        </Paper>
      )}
      sx={{ ...customTextFieldStyles, ...customAutoCompleteStyles }}
    />
  );
};

export default ProposalsList;
