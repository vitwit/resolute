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
    <div
      className={selected ? 'msg-item  primary-gradient' : 'msg-item'}
      onClick={() => onSelect(msg)}
    >
      {msg}
    </div>
  );
};

export default MsgItem;
