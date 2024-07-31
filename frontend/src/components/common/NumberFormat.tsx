
import { formatNumber } from '@/utils/util'
import React from 'react'

function NumberFormat({ value, type, token = '', cls }: { value: string, type: string, token?: string, cls: string }) {
    let parsedAmount = '0';
    let formattedToken = token;

    // Remove commas and split the value by space
    const [numberPart, possibleToken] = value.replace(/,/g, "").split(' ');

    // Parse the number and set the token if provided
    const numberValue = Number(numberPart);
    if (possibleToken) formattedToken = possibleToken;

    // Determine the parsedAmount
    if (numberValue === 0) {
        parsedAmount = '0';
    } else if (numberValue < 0.01) {
        parsedAmount = '< 0.01';
    } else {
        parsedAmount = formatNumber(numberValue);
    }

    return (
        <span className={cls}>
            {type === 'token' ? `${parsedAmount} ${formattedToken}` : `$ ${parsedAmount}`}
        </span>
    );
}


export default NumberFormat