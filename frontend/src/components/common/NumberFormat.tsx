
import { formatNumber } from '@/utils/util'
import React from 'react'

function NumberFormat({ value, type, token, cls }: { value: string, type: string, token?: string, cls: string }) {
    let parsedAmount;

    if (value.split(' ').length > 1) {
        let n1 = value.split(' ')[0]
        n1 = n1.replace(/,/g, "");

        const d = value.split(' ')[1]
        if (Number(n1) === 0) parsedAmount = '0';
        else if (Number(n1) < 0.01) parsedAmount = '< 0.01';
        else parsedAmount = formatNumber(Number(n1))
        token = d;

    } else {
        if (Number(value) === 0) parsedAmount = '0';
        else if (Number(value) < 0.01) parsedAmount = '< 0.01';
        else parsedAmount = formatNumber(Number(value))
    }

    return (
        <>
            {
                type === 'token' ?
                    <span className={cls}>{parsedAmount}  {token}</span> : <span className={cls}> $ {parsedAmount}</span>

            }
        </>
    )
}

export default NumberFormat