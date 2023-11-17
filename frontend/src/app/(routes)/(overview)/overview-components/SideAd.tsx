import Image from "next/image";
import React from "react";

const SideAd = () => {
  return (
    <div className="my-10 cursor-pointer text-white">
      <Image src="/side-ad-sample.png" height={216} width={326} alt="Ad" />
    </div>
  );
};

export default SideAd;
