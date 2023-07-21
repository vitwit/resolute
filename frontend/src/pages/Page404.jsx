import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


export default function Page404() {
    const navigate = useNavigate();

    return (
        <div style={{ marginTop: 72 }}>
            <Typography
                variant='h1'
                color='text.primary'
                fontWeight={700}
            >
                404
            </Typography>
            <Typography
                variant='h6'
                gutterBottom
                color='text.secondary'
                fontWeight={500}
            >
                Page not found
            </Typography>
            <Button
                className='button-capitalize-title'
                disableElevation
                variant='contained'
                size='small'
                onClick={() => navigate("/")}
            >
                Go to Home
            </Button>
        </div>
    );
}