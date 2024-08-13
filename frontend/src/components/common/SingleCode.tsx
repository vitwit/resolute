import React, { useState } from 'react';
import PageHeader from './PageHeader';
import SearchContracts from './SearchContracts';
import Image from 'next/image';

const contractsData = [
  {
    address: 'osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9',
    imageUrl: '/akash1.png',
  },
  {
    address: 'osmo1jkd2lgc54nm4jkwjqz5npqh4z2hy7vry8wrtdkmr3uj2n7g6vy8sdzqk9x',
    imageUrl: '/akash1.png',
  },
  {
    address: 'osmo12uvv4zj92a9m3w82p0phj0t6tjk5yz7m5s5lr89ykgtfx5e8wx64klyxsx',
    imageUrl: '/akash1.png',
  },
];

const SingleCode = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredContracts = contractsData.filter((contract) =>
    contract.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col py-10 gap-10">
      <div className="flex flex-col gap-6">
        <div className="secondary-btn">Go back</div>
        <SingleCodeHeader />
      </div>

      <div className="px-6">
        <SearchContracts
          searchQuery={searchQuery}
          handleSearchQueryChange={handleSearchQueryChange}
        />
      </div>

      <div className="px-6 flex flex-col gap-6">
        {filteredContracts.map((contract, index) => (
          <div key={index} className="">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Image
                  src={contract.imageUrl}
                  width={24}
                  height={24}
                  alt="logo"
                  className="w-6 h-6"
                />
                <p className="text-b1">{contract.address}</p>
              </div>
              <div className="flex gap-6">
                <button className="primary-btn">Execute</button>
                <button className="primary-btn">Query</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleCode;

const SingleCodeHeader = () => {
  return <PageHeader title="Code 1" description="8EC0B9BA0419C682695E74C16" />;
};
