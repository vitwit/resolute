import React from 'react';

const MsgItem = ({
  msg,
  onSelect,
  selected,
}: {
  msg: string;
  onSelect: (chainID: string) => void;
  selected: boolean;
}) => {
  return (
    <button
      type="button"
      className={`msg-item ${selected ? 'msg-item-selected' : ''}`}
      onClick={() => onSelect(msg)}
    >
      <span className="capitalize text-b1">{msg}</span>
    </button>
  );
};

export default MsgItem;
