import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountMenu } from "@/constants/accountMenu";
import { IUser } from "@/types/user";
import Link from "next/link";
import { CheckIcon, PlusIcon, ShieldIcon, Trash2Icon } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { getAddAccountUrl } from "@/services/auth";

export function AvatarButton({
	user,
	logout,
}: {
	user: IUser;
	logout: () => void;
}) {
	const { sessions, switchAccount, removeSession } = useSessions();
	const otherSessions = sessions.filter((s) => !s.is_current);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label="Open account menu"
				>
					<Avatar>
						<AvatarImage
							src={user.avatar_url}
							alt={user.login}
						/>
						<AvatarFallback>
							{user.login.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuGroup>
					{user.role === "admin" && (
						<DropdownMenuItem asChild className="cursor-pointer">
							<Link href="/admin">
								<ShieldIcon className="size-4" />
								Admin panel
							</Link>
						</DropdownMenuItem>
					)}
					{accountMenu.map((am, i) => (
						<DropdownMenuItem key={i} asChild className="cursor-pointer">
							<Link href={am.url}>
								{am.title}
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
					Accounts
				</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem disabled className="cursor-default opacity-100">
						<Avatar className="size-5">
							<AvatarImage src={user.avatar_url} alt={user.login} />
							<AvatarFallback className="text-[10px]">
								{user.login.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="truncate">@{user.login}</span>
						<CheckIcon className="ml-auto size-3.5 shrink-0 text-primary" />
					</DropdownMenuItem>

					{otherSessions.map((s) => (
						<DropdownMenuItem
							key={s.login}
							className="cursor-pointer group"
							onSelect={(e) => e.preventDefault()}
						>
							<button
								className="flex flex-1 min-w-0 items-center gap-2"
								onClick={() => switchAccount(s.login)}
							>
								<Avatar className="size-5 shrink-0">
									<AvatarImage src={s.avatar_url} alt={s.login} />
									<AvatarFallback className="text-[10px]">
										{s.login.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="truncate">@{s.login}</span>
							</button>
							<button
								className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
								onClick={(e) => {
									e.stopPropagation();
									removeSession(s.login);
								}}
								aria-label={`Remove session: ${s.login}`}
							>
								<Trash2Icon className="size-3.5" />
							</button>
						</DropdownMenuItem>
					))}

					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => { window.location.href = getAddAccountUrl(); }}
					>
						<PlusIcon className="size-4" />
						Add account
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						onClick={logout}
						className="cursor-pointer"
					>
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
