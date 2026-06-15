import { EMPTY_ILLUSTRATION } from '@/constants/image-names';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const defaultImageWidth = 914;
const defaultImageHeight = 480;

interface EmptyScreenProps {
  title: string;
  description: string;
  width?: number;
  height?: number;
  hasActionBtn?: boolean;
  btnText?: string;
  btnStyles?: string;
  btnLoading?: boolean;
  btnDisabled?: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  btnOnClick?: any;
  bgImage?: string;
}

const EmptyScreen = ({
  title,
  description,
  width = defaultImageWidth,
  height = defaultImageHeight,
  hasActionBtn,
  btnStyles,
  btnText,
  btnLoading,
  btnDisabled,
  btnOnClick,
  bgImage = EMPTY_ILLUSTRATION,
}: EmptyScreenProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center">
          <Image
            src={bgImage}
            width={width}
            height={height}
            alt=""
            draggable={false}
          />
          <div className="empty-screen-title">{title}</div>
        </div>
        <div className="empty-screen-description">{description}</div>
      </div>
      {hasActionBtn ? (
        <button
          className={`primary-btn ${btnStyles}`}
          disabled={btnDisabled}
          type="button"
          onClick={btnOnClick}
        >
          {btnLoading ? (
            <div className="flex justify-center items-center gap-2">
              <CircularProgress size={12} sx={{ color: 'white' }} />
              <span className="italic">
                Pending<span className="dots-flashing"></span>{' '}
              </span>
            </div>
          ) : (
            btnText
          )}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyScreen;
