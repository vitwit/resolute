import React from 'react';

interface SelectTransactionTypeProps {
  isFileUpload: boolean;
  onSelect: (value: boolean) => void;
}

const SelectTransactionType: React.FC<SelectTransactionTypeProps> = (props) => {
  const { isFileUpload, onSelect } = props;
  return (
    <div className="my-6 flex gap-6 text-white">
      <div
        className="custom-radio-button-label"
        onClick={() => onSelect(false)}
      >
        <button className="custom-radio-button">
          {!isFileUpload ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div className="text-[14px] font-medium">Add Manually</div>
      </div>
      <div className="custom-radio-button-label" onClick={() => onSelect(true)}>
        <button className="custom-radio-button">
          {isFileUpload ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div className="text-[14px] font-medium">File Upload</div>
      </div>
    </div>
  );
};

export default SelectTransactionType;
