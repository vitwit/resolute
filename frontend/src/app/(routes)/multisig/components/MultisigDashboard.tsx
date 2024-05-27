import '../multisig.css';
import { Avatar } from '@mui/material';
import Image from 'next/image';

const MultisigDashboard = () => {
  return (
    <div className="flex gap-20 flex-col flex-[1_0_0] self-stretch px-10 py-20">
      <div className="gap-10 flex flex-col w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-start">
            <div className="text-white text-[28px] not-italic font-bold leading-[normal] text-start">
              Multisig
            </div>
            <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
              Connect your wallet now to access all the modules on resolute{' '}
            </div>
          </div>
          <div className="items-center flex">
            <button className="primary-btn">Create Multisig</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 px-6 py-0">
          {[1, 2, 3].map((data, dataid) => (
            <div key={dataid} className="multisig-card">
              <div className="flex space-x-2">
                <Image
                  src="/avatarbg.svg"
                  width={24}
                  height={24}
                  alt="Avatar"
                />
                <p className="text-white text-base not-italic font-normal leading-[normal] flex items-center">
                  Pavani
                </p>
              </div>
              <div className="flex justify-between w-full">
                <div className="space-y-2">
                  <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Address
                  </div>
                  <div className="flex">
                    <div className="text-white text-sm not-italic font-normal leading-[normal]">
                      cosri70jk80....
                    </div>
                    <div className="">
                      <Image
                        src="/copy.svg"
                        width={20}
                        height={20}
                        alt="copy-icon"
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Threshold
                  </div>
                  <div className="text-white text-sm not-italic font-normal leading-[normal]">
                    01
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                    Action Required
                  </div>
                  <div className="text-white text-sm not-italic font-normal leading-[normal]">
                    01
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full gap-10">
        <div className="space-y-2 items-start">
          <div className="text-white text-[28px] not-italic font-bold leading-[normal]">
            Delegations
          </div>
          <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-8">
            Connect your wallet now to access all the modules on resolute{' '}
          </div>
          <div className="horizontal-line"></div>
        </div>

        {[1, 2, 3].map((data, dataid) => (
          <div
            key={dataid}
            className="flex flex-col items-start gap-4 self-stretch px-6 py-0"
          >
            <div className="flex justify-between w-full">
              <div className="flex space-x-4">
                <div className="space-x-2 flex">
                  <Image
                    src="/avatarbg.svg"
                    width={32}
                    height={32}
                    alt="Avatar"
                  />
                  <p className="text-white text-base not-italic font-normal leading-8">
                    Pavani
                  </p>
                </div>
                <div className="alert text-white text-[10px] not-italic font-light leading-6">
                  01 Actions Requred
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 w-full gap-4">
              {[1, 2, 3].map((data, dataid) => (
                <div key={dataid} className="transaction-card w-full">
                  <div className="flex items-center justify-between self-stretch">
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                        Transaction Name
                      </p>
                      <div className="flex space-x-2">
                        <p className="text-white text-sm not-italic font-normal leading-[normal]">
                          Sent 100 AKT to
                          pasg1h329kntmw805f3mqgv40xy8vrmr8prut0v5dv7
                        </p>
                        <Image
                          src="/copy.svg"
                          width={24}
                          height={24}
                          alt="Copy-icon"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                        Signed
                      </p>
                      <div className="flex">
                        <p className="text-white text-sm not-italic font-normal leading-[normal]">
                          1
                        </p>
                        <p className="text-[rgba(255,255,255,0.50)] text-xs not-italic font-normal leading-[normal]">
                          /2
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 justify-center">
                      <button className="primary-btn w-[115px]">Sign</button>
                      <Image
                        src="/more.svg"
                        width={24}
                        height={24}
                        alt="More-icon"
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MultisigDashboard;
