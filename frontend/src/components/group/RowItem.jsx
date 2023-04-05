import { Grid, Typography } from '@mui/material'
import React from 'react'

function RowItem({ lable, value, equal }) {
    return (
        <Grid sx={{ m: 1, p: 0 }} container md={12}>
            <Grid md={equal ? 6 : 4}>
                <Typography sx={{ fontSize: 18, textAlign: 'left' }}> {lable}</Typography>
            </Grid>
            <Grid md={equal ? 6 : 8}>
                <Typography sx={{
                    fontSize: 18,
                    ml: 2,
                    textAlign: 'left',
                    fontWeight: 'bold'
                }}>{value}</Typography>
            </Grid>
        </Grid>
    )
}

export default RowItem