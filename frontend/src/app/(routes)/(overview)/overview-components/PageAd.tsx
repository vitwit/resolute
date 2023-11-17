import Image from "next/image";
import React from "react";

const PageAd = () => {
  return (
    <div className="my-10 cursor-pointer brightness-50">
      <Image className="w-full" src="/page-ad-sample.png" width={1000} height={80} alt="Ad" />
    </div>
  );
};

export default PageAd;
