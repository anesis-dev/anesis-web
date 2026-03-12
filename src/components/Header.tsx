import Logo from "./Logo";
import Nav from "./Nav";
import { Search } from "./Search";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="w-full h-[8vh] px-5 flex justify-between items-center">
      <div className="flex gap-4">
        <Logo />
        <Nav />
      </div>
      <div className="flex gap-5">
        <Search />
        <AuthButton />
      </div>
    </header>
  );
}
