interface VoteOption {
  label: string;
  value: number;
  selectedColor: string;
}

export const GOV_VOTE_OPTIONS: VoteOption[] = [
  {
    label: 'Yes',
    value: 1,
    selectedColor: '#2BA472',
  },
  {
    label: 'No',
    value: 3,
    selectedColor: '#D92101',
  },
  {
    label: 'Abstain',
    value: 2,
    selectedColor: '#FFC13C',
  },
  {
    label: 'Veto',
    value: 4,
    selectedColor: '#DA561E',
  },
];
