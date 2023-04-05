import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationElementProps {
  total: number;
  handlePagination: (key: number) => void;
  paginationKey: string;
}

export default function PaginationElement({ total, 
  paginationKey,
  handlePagination }:
  PaginationElementProps) {
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {

    setPage(value);
    handlePagination(value-1)
  };

  return (
    <Stack mt={3} spacing={2}>
      <Pagination
        count={Math.ceil(total / 1)} page={page} onChange={handleChange} />
    </Stack>
  );
}
