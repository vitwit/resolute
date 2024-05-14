import CommonCopy from '@/components/CommonCopy';
import { shortenMsg } from '@/utils/util';
import Link from 'next/link';
import React from 'react';
import PermissionsData from './PermissionsData';

const CodeItem = ({ code }: { code: CodeInfo }) => {
  return (
    <tr>
      <td>{code.code_id}</td>
      <td>
        <Link
          className="hover:underline underline-offset-[3px]"
          href={`?code_id=${code.code_id}`}
        >
          {shortenMsg(code.data_hash, 25)}
        </Link>
      </td>
      <td>
        <CommonCopy
          message={code.creator}
          style="w-fit text-white"
          plainIcon={true}
        />
      </td>
      <td>
        <PermissionsData permission={code.instantiate_permission} />
      </td>
    </tr>
  );
};

export default CodeItem;
