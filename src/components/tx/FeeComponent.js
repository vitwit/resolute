import { Box, Button } from '@mui/material'
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ButtonGroup from '@mui/material/ButtonGroup';

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    display: 'block',
    border: '1px solid',
    borderColor: '#0063cc',
    '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
        boxShadow: 'none',
        color: '#FFF'
    },
    '&:active': {
        color: '#FFF',
        boxShadow: 'none',
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        backgroundColor: '#0062cc',
        color: '#FFF'
    },
});


function FeeComponent({ chainInfo, onSetFeeChange }) {
    const [active, setActive] = useState('average')
    const { config } = chainInfo;
    const { gasPriceStep = {} } = config;

    return (
        <>
            <h5 style={{color: '#6b6b6b'}}>Fee</h5>
            <Box style={{ display: 'flex' }}>
                <ButtonGroup aria-label="outlined primary button group">

                    {
                        Object.entries(gasPriceStep).map(([key, value]) => (
                            <BootstrapButton
                                onClick={() => {
                                    onSetFeeChange(value)
                                    setActive(key);
                                }}
                                variant={active === key ? 'contained' : null}
                            >
                                <span style={{color: active === key?'': '#6b6b6b'}}>{key}</span><br />
                                <span style={{color: active === key?'': '#6b6b6b'}}>{value} {chainInfo?.config.currencies[0].coinMinimalDenom}</span>
                            </BootstrapButton>
                        ))
                    }
                </ButtonGroup>
                
            </Box>
            <p style={{color: '#6b6b6b', fontSize: 12}}>Note: Select high fee, if you have more signatures.</p>
        </>
    )
}

export default FeeComponent