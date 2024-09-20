import React from 'react';

interface CustomRadioGroupProps {
  isDenyList: boolean;
  onSelect: (value: boolean) => void;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = (props) => {
  const { isDenyList, onSelect } = props;
  return (
    <div className="mt-6 mb-4 flex items-center gap-6 text-white">
      <div
        className="custom-radio-button-label"
        onClick={() => onSelect(false)}
      >
        <button className="custom-radio-button">
          {!isDenyList ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div
          className={
            !isDenyList ? 'text-[14px] font-medium w-[66px]' : 'text-[14px] font-light w-[66px]'
          }
        >
          Allow List
        </div>
      </div>
      <div className="custom-radio-button-label" onClick={() => onSelect(true)}>
        <button className="custom-radio-button">
          {isDenyList ? (
            <div className="custom-radio-button-checked"></div>
          ) : null}
        </button>
        <div
          className={
            isDenyList ? 'text-[14px] font-medium w-[66px]' : 'text-[14px] font-light w-[66px]'
          }
        >
          Deny List
        </div>
      </div>
    </div>
  );
};

export default CustomRadioGroup;
