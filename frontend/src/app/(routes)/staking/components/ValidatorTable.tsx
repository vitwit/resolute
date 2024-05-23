import Image from 'next/image';

const ValidatorTable = () => {
  return (
    <div className="flex flex-col gap-10 self-stretch overflow-scroll h-[50vh] px-10">
      <div className="space-y-1">
        <div className="text-white text-lg not-italic font-normal leading-[27px]]">
          Validators
        </div>
        <div className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-extralight leading-[21px]">
          Connect your wallet now to access all the modules on resolute
        </div>
        <div className="horizontal-line"></div>
      </div>
      <div className="flex flex-col items-start gap-10 self-stretch px-6 py-0">
        <div className="search-bar">
          <Image src="/search.svg" width={24} height={24} alt="Search-ICon" />
          <p className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
            Search Validator
          </p>
        </div>
        <div className="w-full flex flex-col items-start gap-2 self-stretch p-6 overflow-y-scroll h-[30vh]">
          <table className="relative w-full">
            <thead className="w-full">
              <tr>
                <th className="w-1/6">
                  <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                    Rank
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                    Validator
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                    Commission
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                    Voting Power
                  </div>
                </th>
                <th className="w-1/5">
                  <div className="text-[rgba(255,255,255,0.50)] text-base not-italic font-normal leading-[normal]">
                    Status
                  </div>
                </th>
                <th className="w-1/6">
                  <div></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((data, dataid) => (
                <tr key={dataid} className="table-border-line">
                  <th className="px-0 py-8">
                    <div className="flex flex-col items-center">
                      <div className="text-white text-base not-italic font-normal leading-[normal]">
                        #1
                      </div>
                    </div>
                  </th>
                  <th className="">
                    <div className="flex space-x-2">
                      <Image
                        src="/cosmostation"
                        width={24}
                        height={24}
                        alt="cosmostation-logo"
                      />
                      <p className="text-white text-base not-italic font-normal leading-[normal]">
                        Cosmostation
                      </p>
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-base not-italic font-normal leading-[normal]">
                      40 Atoms
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-base not-italic font-normal leading-[normal]">
                      $ 89.46
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-base not-italic font-normal leading-[normal]">
                      $ 89.46
                    </div>
                  </th>
                  <th className="">
                    <div className="text-white text-base not-italic font-normal leading-[normal] ">
                      <button className="custom-btn ">Delegate</button>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ValidatorTable;
