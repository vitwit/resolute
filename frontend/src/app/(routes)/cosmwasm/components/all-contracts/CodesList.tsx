import React from 'react'
import TableHeader from './TableHeader';
import CodeItem from './CodeItem';

const CodesList = (props: { codes: CodeInfo[] }) => {
    const { codes } = props;
    const tableColumnTitle = ['Code Id', 'Code Hash', 'Creator', 'Permissions'];
    return (
      <div className="codes-table">
        <table className="w-full text-sm leading-normal">
          <thead className="border-b-[0.5px] border-[#B0B0B033] relative">
            <tr className="text-left">
              {tableColumnTitle.map((title) => (
                <TableHeader key={title} title={title} />
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <CodeItem key={code.code_id} code={code} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default CodesList