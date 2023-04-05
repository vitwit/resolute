import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/system';
import { FormHelperText } from '@mui/material';

interface TxTypeComponentProps {
    handleType: any
}

export default function TxTypeComponent({ handleType }: TxTypeComponentProps) {
    const [value, setValue] = React.useState('');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        handleType((event.target as HTMLInputElement).value);
    };

    return (
        <Box>
            <FormControl sx={{ ml: 5, mt: 3 }} fullWidth>
                <FormLabel sx={{ textAlign: 'left' }} id="demo-row-radio-buttons-group-label">
                    How do you want a add transaction?
                </FormLabel>
                <RadioGroup
                    value={value}
                    onChange={handleRadioChange}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel sx={{ width: '20%' }} value="single"
                        control={<Radio />} label="Manually" />
                    <FormControlLabel sx={{ width: '20%' }} value="multiple"
                        control={<Radio />} label="Upload through file" />
                </RadioGroup>
                <FormLabel sx={{ display: 'flex' }}>
                    <FormHelperText sx={{ width: '19%' }}>Only one transaction at a time.</FormHelperText>
                    <FormHelperText>Multiple transactions at a time.</FormHelperText>
                </FormLabel>
            </FormControl>
        </Box>

    );
}
