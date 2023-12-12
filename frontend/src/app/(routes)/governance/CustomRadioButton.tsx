import React from 'react';

const RadioButton = ({
  name,
  value,
  voteOption,
  handleVoteChange,
  displayOption,
}: {
  name: string;
  value: string;
  voteOption: string;
  handleVoteChange: (value: string) => void;
  displayOption: string;
}) => {
  return (
    <label className="radio-container">
      <div className="flex space-x-2">
        <input
          type="radio"
          name={name}
          value={value}
          checked={voteOption === value}
          onChange={() => handleVoteChange(value)}
        />
        <span className="radio-checkmark">
          <span className="radio-check"></span>
        </span>
        <span className="flex relative bottom-1">{displayOption}</span>
      </div>
    </label>
  );
};

export default RadioButton;
