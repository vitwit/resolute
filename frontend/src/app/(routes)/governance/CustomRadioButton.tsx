import React from 'react';

const RadioButtons = ({
  name,
  value,
  voteOption,
  handleVoteChange,
}: {
  name: string;
  value: string;
  voteOption: string;
  handleVoteChange: (value: string) => void;
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
        <span className="flex relative bottom-1">{value}</span>
      </div>
    </label>
  );
};

export default RadioButtons;
