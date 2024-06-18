import Image from 'next/image';

const WithConnectionIllustration = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col justify-center  gap-10 w-full px-10 mt-20">
      {/* <div className="flex flex-col items-start space-y-1">
        <div className="text-h1">Staking</div>
        <div className="text-b1-light">
          Connect your wallet now to access all the modules on resolute{' '}
        </div>
        <div className="divider-line"></div>
      </div> */}

      <div className="flex flex-col justify-center items-center gap-10">
        <div className="flex flex-col gap-6">
          <Image
            src="/illustrate.png"
            width={232}
            height={200}
            alt="Illustration"
          />
          <div className="flex flex-col justify-center items-center w-full">
            <p className="empty-screen-title"> {message} </p>
            {/* <p className="secondary-text">
              Connect your wallet to access your account on Resolute
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithConnectionIllustration;
