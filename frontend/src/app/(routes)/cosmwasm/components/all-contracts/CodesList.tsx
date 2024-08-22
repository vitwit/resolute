import React from 'react';
import CodeItem from './CodeItem';

const CodesList = (props: { codes: CodeInfo[] }) => {
  const { codes } = props;
  return (
    <div className="space-y-6">
      {codes.map((code) => (
        <CodeItem key={code.code_id} code={code} />
      ))}
    </div>
  );
};

export default CodesList;
