import Button from "@mui/material/Button";
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export default function ConnectWallet() {
    return (
        <>
            <Box>
                <Typography
                    variant='h5'
                    gutterBottom
                    color="text.primary"
                >
                    Wallet not connected
                </Typography>
                <Button
                    variant="contained"
                    disableElevation

                >
                    Connect
                </Button>
            </Box>
        </>
    )
}
