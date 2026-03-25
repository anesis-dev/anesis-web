import Logo from "./Logo";
import { MobileHeaderMenu } from "./MobileHeaderMenu";
import Nav from "./Nav";
import { Search } from "./Search";
import AuthButton from "./AuthButton";

export default function Header() {
	return (
		<header className="w-full border-b bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-5">
				<div className="flex items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-4 lg:flex-1">
						<Logo />
						<div className="hidden min-w-0 flex-1 lg:block">
							<Nav />
						</div>
					</div>

					<div className="hidden items-center gap-3 lg:flex">
						<Search />
						<AuthButton />
					</div>

					<div className="lg:hidden">
						<MobileHeaderMenu />
					</div>
				</div>

				<div className="lg:hidden">
					<div className="w-full">
						<Search />
					</div>
				</div>
			</div>
		</header>
	);
}
