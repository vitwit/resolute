import { Alert, Card, Typography } from '@mui/material'
import React from 'react'
import { gpStyles } from './groupCmpStyles'

interface AlertMsgProps {
    text: string,
    type: string
}

const AlertMsg = ({ text, type = 'error' }: AlertMsgProps) => {
    return (
        <Card sx={gpStyles.alert_card}>
            {
                type === 'info' && <Alert
                    variant='outlined'
                    severity="info">
                    <Typography>{text}</Typography>
                </Alert>
            }

            {
                type === 'error' && <Alert variant='outlined' severity="error">
                    <Typography>{text}</Typography>
                </Alert>
            }
        </Card>
    )
}

export default AlertMsg