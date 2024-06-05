import Image from 'next/image';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <div className="flex space-x-2 w-full">
        <Image src="/search.svg" width={24} height={24} alt="Search-ICon" />
        <input
          className="secondary-text bg-transparent border-none w-full"
          placeholder="Search by Transaction Hash.."
        />
      </div>
    </div>
  );
};
export default SearchBar;
