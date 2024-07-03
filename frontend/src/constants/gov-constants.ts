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
    selectedColor: '#2BA4721A',
  },
  {
    label: 'No',
    value: 3,
    // color: '#D92101',
    selectedColor: '#D921011A',
  },
  {
    label: 'Abstain',
    value: 2,
    // color: '#FFC13C',
    selectedColor: '#FFC13C1A',
  },
  {
    label: 'Veto',
    value: 4,
    // color: '#DA561E',
    selectedColor: '#DA561E1A',
  },
];
