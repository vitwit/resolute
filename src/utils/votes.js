
export function formatVoteOption(option) {
    switch (option) {
        case 'VOTE_OPTION_YES':
            return "Yes"
        case 'VOTE_OPTION_NO':
            return "No"
        case 'VOTE_OPTION_ABSTAIN':
            return "Abstain"
        case 'VOTE_OPTION_NO_WITH_VETO':
            return "NoWithVeto"
        default:
            return ""
    }
}


export function nameToOption(name) {
    switch (name) {
        case 'yes':
            return 1
        case 'no':
            return 2
        case 'abstain':
            return 3
        case 'noWithVeto':
            return 4
        default:
            return 0
    }
}