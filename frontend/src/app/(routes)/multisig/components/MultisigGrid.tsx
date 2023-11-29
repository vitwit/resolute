import React from 'react';
import Image from 'next/image';

interface MultisigGridProps {
  multisigname: string;
  time: string;
  address: string;
  actionrequired: number;
  threshold: number;
}

const MultisigGrid: React.FC<MultisigGridProps> = ({
  multisigname,
  time,
  address,
  actionrequired,
  threshold,
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image
              src="./copy.svg"
              width={24}
              height={24}
              alt="Copy-ICon"
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image src="./copy.svg" width={24} height={24} alt="Copy-ICon" />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image src="./copy.svg" width={24} height={24} alt="Copy-ICon" />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image src="./copy.svg" width={24} height={24} alt="Copy-ICon" />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image src="./copy.svg" width={24} height={24} alt="Copy-ICon" />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
      <div className="multisig-box">
        <div className="flex justify-between w-full">
          <div className="multisig-text">{multisigname} </div>
          <div className="multisig-text">{time}</div>
        </div>
        <div>
          <div className="multisig-text">Address</div>
          <div className="flex space-x-2">
            <div className="multisig-text-l">{address}</div>
            <Image src="./copy.svg" width={24} height={24} alt="Copy-ICon" />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col space-y-2 ">
            <div className="flex multisig-text">Actions Required</div>
            <div className="flex multisig-text-l">{actionrequired}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex multisig-text">Threshold</div>
            <div className="flex multisig-text-l">{threshold}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultisigGrid;
