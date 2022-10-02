import { Grid, Paper, Skeleton } from '@mui/material'
import Typography, { TypographyProps } from '@mui/material/Typography';
import { experimentalStyled as styled } from '@mui/material/styles';
import React from 'react'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function CardSkeleton() {
    const variant = [
        'h5',
        'h6',
        'h1',
    ] as readonly TypographyProps['variant'][];
    const variants = [{ variant }, { variant }, { variant }]

    return (
        <Grid container>
            {variants.map((variant) => (
                <Grid sx={{ p: 2 }} md={4}>
                    <Item>
                        {
                            variant?.variant.map(v => (
                                <Typography component="div"
                                    key={v} variant={v}>
                                    <Skeleton />
                                </Typography>
                            ))
                        }
                    </Item>
                </Grid>
            ))}
        </Grid>
    )
}

export default CardSkeleton