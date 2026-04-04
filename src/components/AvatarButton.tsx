import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountMenu } from "@/constants/accountMenu";
import { IUser } from "@/types/user";
import Link from "next/link";
import { ShieldIcon } from "lucide-react";

export function AvatarButton({
	user,
	logout,
}: {
	user: IUser;
	logout: () => void;
}) {
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
							className="grayscale"
						/>
						<AvatarFallback>
							{user.login.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-32">
				<DropdownMenuGroup>
					{user.role === "admin" && (
						<DropdownMenuItem asChild className="cursor-pointer">
							<Link href="/admin">
								<ShieldIcon className="size-4" />
								Admin Panel
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
