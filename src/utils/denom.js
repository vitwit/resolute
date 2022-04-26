
export function formatVotingPower (tokens) {
    let temp = tokens/1000000.0
    return `${parseFloat((temp.toFixed(2))).toLocaleString()}`
}


export function parseSpendLimit (tokens) {
    if (tokens.length > 0) {
    let temp = tokens[0].amount/1000000.0
    return `${parseFloat((temp.toFixed(6)))}`
    }

    return 0
}

