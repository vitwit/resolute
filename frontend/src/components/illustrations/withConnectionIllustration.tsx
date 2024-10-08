import Image from 'next/image';

const WithConnectionIllustration = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col justify-center gap-10 w-full p-6">
      <div className="flex flex-col justify-center items-center gap-6 relative">
        <Image
          src="/illustrate.png"
          width={180}
          height={180}
          alt="Illustration"
          draggable={false}
          // className="opacity-20"
        />
        <p className="empty-screen-title text-center">{message}</p>
        {/* <div className="absolute flex flex-col justify-center items-center w-full h-full top-0 left-0">
          <p className="empty-screen-title text-center">{message}</p>
        </div> */}
      </div>
    </div>
  );
};

export default WithConnectionIllustration;
