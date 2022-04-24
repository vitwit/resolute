
export function formatVotingPower (tokens) {
    let temp = tokens/1000000.0
    return `${parseFloat((temp.toFixed(2))).toLocaleString()}`
}