import React from 'react';
import "../staking.css"

const InputField = ({ value, onChange }: { value: number, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; }) => {
  return <input className="amount-input-field"
    onChange={onChange}
    type='number'
    value={value}
    placeholder="0" required />;
};

export default InputField;
