import React from 'react';
import '../staking.css';

const InputField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      className="amount-input-field !text-[28px] text-[#fffffff0]"
      onChange={onChange}
      type="number"
      value={value === 0 ? undefined : value}
      placeholder="0"
      required
    />
  );
};

export default InputField;
