
export function formatVotingPower (tokens) {
    let temp = tokens/1000000.0
    return `${parseFloat((temp.toFixed(2))).toLocaleString()}`
}


export function parseSpendLimit (tokens) {
    if (tokens.length > 0) {
    let temp = tokens[0].amount/1000000.0
        return parseFloat((temp.toFixed(6)))
    }

    return 0
}

export function parseTokens (tokens, displayName, coinDecimals) {
    if (tokens === null || tokens.length === 0) { return 0.0 }
    if (Array.isArray(tokens)) {
        const token = tokens[0]
        const temp = token.amount/(10.0 ** coinDecimals)
        return `${parseFloat((temp.toFixed(6)))} ${displayName}`

    } else {
        const temp = tokens.amount/(10.0 ** coinDecimals)
        return `${parseFloat((temp.toFixed(6)))} ${displayName}`
    }
}


export function totalBalance (tokens, coinDecimals) {
    if (tokens === null || Object.keys(tokens).length === 0) { return 0.0 }
    if (Array.isArray(tokens)) {
        const token = tokens[0]
        const temp = token.amount/(10.0 ** coinDecimals)
        return parseFloat((temp.toFixed(6)))

    } else {
        const temp = tokens.amount/(10.0 ** coinDecimals)
        return parseFloat((temp.toFixed(6)))
    }
}
