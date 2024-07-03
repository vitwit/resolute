interface VoteOption {
  label: string;
  value: number;
  // color: string;
  selectedColor: string;
}

export const GOV_VOTE_OPTIONS: VoteOption[] = [
  {
    label: 'Yes',
    value: 1,
    // color: '#2BA472',
    selectedColor: '#2BA472',
  },
  {
    label: 'No',
    value: 3,
    // color: '#D92101',
    selectedColor: '#D92101',
  },
  {
    label: 'Abstain',
    value: 2,
    // color: '#FFC13C',
    selectedColor: '#FFC13C',
  },
  {
    label: 'Veto',
    value: 4,
    // color: '#DA561E',
    selectedColor: '#DA561E',
  },
];
