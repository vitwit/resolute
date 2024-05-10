import React from 'react';

interface SelectSearchTypeProps {
  isEnterManually: boolean;
  onSelect: (value: boolean) => void;
}

const SelectSearchType: React.FC<SelectSearchTypeProps> = (props) => {
  const { isEnterManually, onSelect } = props;
  return (
    <div className="flex items-center gap-6 text-white h-9">
      <div
        className="custom-radio-button-label"
        onClick={() => onSelect(true)}
      >
        <button className="custom-radio-button">
          {isEnterManually ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div className="text-[14px] font-light">Enter Address Manually</div>
      </div>
      <div className="custom-radio-button-label" onClick={() => onSelect(false)}>
        <button className="custom-radio-button">
          {!isEnterManually ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div className="text-[14px] font-light">Select from List</div>
      </div>
    </div>
  );
};

export default SelectSearchType;
