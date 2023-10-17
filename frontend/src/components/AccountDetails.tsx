import Image from "next/image";
import React from "react";

const AccountDetails = () => {
  return (
    <div className="details-overview-card">
      <div className="network-data">
        <Image
          src="/akash.svg"
          width={40}
          height={40}
          alt="network image.."
        ></Image>
        <div className="address">akash1y0hvu8ts6mnpc7yltgj8g56v</div>
        <Image
          src="/copy.svg"
          width={38}
          height={38}
          alt="copy address.."
          className="cursor-pointer"
        ></Image>

        <div />
      </div>
      <div className="flex flex-end space-x-12">
        <div className="account-metadata">
          <div className="account-metadata__title">Public Key</div>

          <div className="flex justify-between space-x-2">
            <div className="account-metadata__content">
              A548OhedNfWrFXPfe5...
            </div>
            <Image
              src="/copy.svg"
              width={24}
              height={24}
              alt="copy address.."
              className="cursor-pointer"
            ></Image>
          </div>
        </div>
        <div className="account-metadata">
          <div className="account-metadata__title">Account Number</div>

          <div className="account-metadata__content">1234567893</div>
        </div>
        <div className="account-metadata">
          <div className="account-metadata__title">Sequence</div>

          <div className="account-metadata__content">000000</div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
