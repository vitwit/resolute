import React from 'react';

const TransactionLoading = () => {
  return (
    <div className="space-y-6 mt-10">
      <TransactionHeader />
      <div className="flex gap-10 w-full">
        <div className="flex-1 flex w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-[90px] w-[352px] shimmer rounded-lg">
                <div className="flex flex-col items-center gap-4 w-full shimmer rounded-lg">
                  <p className="shimmer-line"></p>
                  <div className="shimmer-line"></div>
                </div>
              </div>
              <div className="h-[90px] w-[352px] shimmer rounded-lg">
                <div className="flex flex-col items-center gap-4 w-full shimmer rounded-lg">
                  <p className="shimmer-line"></p>
                  <div className="shimmer-line"></div>
                </div>
              </div>
            </div>
            {Array(4)
              .fill(null)
              .map((index) => (
                <div
                  key={index}
                  className="flex justify-between px-6 w-full pb-4 shimmer rounded-lg"
                >
                  <div className="flex flex-col gap-2 shimmer rounded">
                    <p className="shimmer-line"></p>
                    <span className="shimmer-line"></span>
                  </div>
                  <div className="flex flex-col gap-2 shimmer rounded">
                    <p className="shimmer-line"></p>
                    <div className="shimmer-line"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {Array(3)
            .fill(null)
            .map((index) => (
              <div
                key={index}
                className="h-[90px] w-[352px] shimmer rounded-lg"
              >
                <div className="flex flex-col items-center gap-4 w-full shimmer rounded-lg">
                  <p className="shimmer-line"></p>
                  <div className="shimmer-line"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionLoading;

const TransactionHeader = () => {
  return (
    <div className="space-y-4">
      <div className="shimmer rounded w-12 h-5 mb-8"></div>
      <div className="flex items-center gap-2">
        <div className="shimmer rounded-full w-6 h-6"></div>
        <div className="shimmer rounded w-[200px] h-6"></div>
      </div>
      <div className="divider-line"></div>
    </div>
  );
};
