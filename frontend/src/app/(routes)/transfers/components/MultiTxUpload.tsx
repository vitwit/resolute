import Image from 'next/image';
import { parseSendMsgsFromContent } from '@/utils/parseMsgs';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/StateHooks';
import { setError } from '@/store/features/common/commonSlice';
import { SEND_TEMPLATE } from '@/utils/constants';

const MultiTxUpload = ({
  chainID,
  addMsgs,
}: {
  chainID: string;
  addMsgs: (msgs: Msg[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const address = useAppSelector(
    (state) => state.wallet.networks[chainID].walletInfo.bech32Address
  );

  const onFileContents = (content: string | ArrayBuffer | null) => {
    const [parsedTxns, error] = parseSendMsgsFromContent(
      address,
      '\n' + content
    );
    if (error) {
      dispatch(
        setError({
          type: 'error',
          message: error,
        })
      );
    } else {
      addMsgs(parsedTxns);
    }
  };

  return (
    <div className="space-y-2 flex flex-col flex-1">
      <div className="w-full flex justify-between items-center">
        <div className="text-sm not-italic font-normal leading-[normal]">
          File Upload
        </div>
        <div className="text-right text-xs not-italic font-normal leading-[normal]">
          Download Sample{' '}
          <span
            className="text-xs not-italic font-bold leading-[normal] underline cursor-pointer"
            onClick={() => {
              window.open(SEND_TEMPLATE, '_blank', 'noopener,noreferrer');
            }}
          >
            here
          </span>
        </div>
      </div>
      <div
        className="file-upload-box flex flex-col flex-1"
        style={{
          backgroundColor: '#1a1731',
          height: '228px',
        }}
        onClick={() => {
          const element = document.getElementById('multiTxns_file');
          if (element) element.click();
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/file-upload-icon.svg"
              width={48}
              height={48}
              alt="Upload file"
            />
            <div className="mt-2 mx-12 text-center text-xs not-italic font-normal leading-5">
              Upload CSV File, Each line must contain “Recipient Amount”
            </div>
            <div />
          </div>
          <input
            id="multiTxns_file"
            accept="*.csv"
            hidden
            type="file"
            onChange={(e) => {
              if (!e?.target?.files) return;
              const file = e.target.files[0];
              if (!file) {
                return;
              }

              const reader = new FileReader();
              reader.onload = (e) => {
                if (!e.target) return null;
                const contents = e.target.result;
                onFileContents(contents);
              };
              reader.onerror = (e) => {
                dispatch(
                  setError({
                    type: 'error',
                    message: '' + (e.target?.error || 'Something went wrong. '),
                  })
                );
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiTxUpload;
