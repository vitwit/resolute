import React, { useState } from "react";
import { shortenAddress } from "../../utils/util";

const NameAddress = ({ address, name }) => {
  const [show, setShow] = useState(false);
  const toggleAddress = () => {
    setShow(!show);
  };
  return (
    <div onClick={toggleAddress} style={{ cursor: "pointer" }}>
      {show ? shortenAddress(address, 24) : name || shortenAddress(address, 24)}
    </div>
  );
};

export default NameAddress;