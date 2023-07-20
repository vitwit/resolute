import React from "react"
import { Typography } from "@mui/material"
import { Box } from "@mui/system"

export default function ConnectWallet() {

    return (
        <Box
            sx={{
                mt: 4,
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                fontWeight={600}
                color="text.primary"
            >
                Wallet not connected
            </Typography>
        </Box>
    )
}
