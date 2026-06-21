import Logo from "./Logo";
import { MobileHeaderMenu } from "./MobileHeaderMenu";
import Nav from "./Nav";
import { Search } from "./Search";
import AuthButton from "./AuthButton";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/78 backdrop-blur-2xl">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-5">
				<div className="flex items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-4 xl:flex-1">
						<Logo />
						<div className="hidden min-w-0 flex-1 xl:block">
							<Nav />
						</div>
					</div>

					<div className="hidden min-w-0 flex-1 items-center justify-end gap-3 xl:flex">
						<Search className="w-[11rem] xl:w-[12rem] 2xl:w-[14rem]" />
						<div className="shrink-0">
							<AuthButton />
						</div>
					</div>

					<div className="flex items-center gap-2 xl:hidden">
						<Search variant="icon" />
						<MobileHeaderMenu />
					</div>
				</div>
			</div>
		</header>
	);
}
