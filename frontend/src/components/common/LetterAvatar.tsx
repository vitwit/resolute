import { Avatar } from '@mui/material';
import React from 'react';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string, width: string, height: string) {
  const spaceIndex = name.indexOf(' ');
  const firstName = spaceIndex !== -1 ? name.split(' ')[0] : name;

  const firstInitial = firstName[0].toLowerCase();

  const secondInitial =
    spaceIndex !== -1 && name.split(' ')[1]
      ? name.split(' ')[1][0].toLowerCase()
      : '';

  return {
    sx: {
      bgcolor: stringToColor(name),
      width,
      height,
      fontSize: '16px',
      color: 'black',
      fontWeight: 700,
      fontStyle: 'italic',
    },
    children: `${firstInitial}${secondInitial}`,
  };
}

const LetterAvatar = ({
  name,
  height = '24px',
  width = '24px',
}: {
  name: string;
  width?: string;
  height?: string;
}) => {
  return name?.length ? (
    <Avatar {...stringAvatar(name, width, height)} />
  ) : null;
};

export default LetterAvatar;
