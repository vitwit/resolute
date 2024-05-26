import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <div className="fixed-layout">
      <TopBarLoading />
      <main className="main">
        <div className="main-container">
          <SideBarLoading />
        </div>
      </main>
    </div>
  );
};

export default Loading;

const TopBarLoading = () => {
  return (
    <header className="top-bar">
      <nav>
        <div>
          <Image
            src="/resolute-logo.png"
            width={120}
            height={32}
            alt="Resolute"
          />
        </div>
        <div className="w-[170px] animate-pulse h-[40px] bg-[#252525] rounded" />
      </nav>
    </header>
  );
};

const SideBarLoading = () => {
  return (
    <section className="sidebar">
      <SelectNetworkLoading />
      <SideMenuLoading />
      <MenuItemLoading />
    </section>
  );
};

const SelectNetworkLoading = () => {
  return (
    <div className="fixed-top w-full">
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full bg-[#252525]" />
        <div className="flex-1">
          <div className="h-8 w-full rounded bg-[#252525] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const SideMenuLoading = () => {
  const menuOptions = Array.from(Array(10).keys());
  return (
    <div className="scrollable-content w-full">
      <div className="flex flex-col gap-2">
        {menuOptions.map((i) => (
          <MenuItemLoading key={i} />
        ))}
      </div>
    </div>
  );
};

const MenuItemLoading = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-[#252525] animate-pulse rounded-full" />
      <div className="h-7 flex-1 bg-[#252525] animate-pulse rounded" />
    </div>
  );
};
