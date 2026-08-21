import type { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <div className="flex w-full flex-col">
      <h1 className="text-3xl font-bold tracking-wide text-ink sm:text-4xl">
        RMNDR
      </h1>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export default Header;
