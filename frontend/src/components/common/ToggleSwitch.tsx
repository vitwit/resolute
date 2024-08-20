import { TOGGLE_OFF, TOGGLE_ON } from '@/constants/image-names';
import Image from 'next/image';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  text: string;
  width?: number;
  height?: number;
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  const { checked, onChange, text, height = 14.8, width = 20 } = props;

  return (
    <button
      className="flex items-center gap-[6px]"
      type="button"
      onClick={() => onChange(!checked)}
    >
      <Image
        src={checked ? TOGGLE_ON : TOGGLE_OFF}
        width={width}
        height={height}
        alt=""
      />
      <div className="text-[14px] font-extralight">{text}</div>
    </button>
  );
};

export default ToggleSwitch;
