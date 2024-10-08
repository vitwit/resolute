import React from 'react';

const MoreOptions = ({
  setOptionsOpen,
  hanldeDeleteTxn,
  onViewRaw,
  allowRepeat,
  onRepeat,
}: {
  setOptionsOpen: (value: boolean) => void;
  hanldeDeleteTxn: () => void;
  onViewRaw: () => void;
  allowRepeat: boolean;
  onRepeat: () => void;
}) => {
  return (
    <div
      className="more-options"
      onMouseEnter={() => setOptionsOpen(true)}
      onMouseLeave={() => setOptionsOpen(false)}
    >
      <button
        onClick={hanldeDeleteTxn}
        className={`hover:bg-[#FFFFFF14] cursor-pointer p-4 text-b1 text-left`}
      >
        Delete
      </button>
      <button
        onClick={onViewRaw}
        className={`hover:bg-[#FFFFFF14] cursor-pointer p-4 text-b1 text-left`}
      >
        View Raw
      </button>
      {allowRepeat ? (
        <button
          onClick={onRepeat}
          className={`hover:bg-[#FFFFFF14] cursor-pointer p-4 text-b1 text-left`}
        >
          Repeat Txn
        </button>
      ) : null}
    </div>
  );
};

export default MoreOptions;
