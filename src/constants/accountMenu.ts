/**
 * Account navigation menu items.
 *
 * Links rendered in the authenticated user's account dropdown and the mobile
 * menu "Account" section. Maps to routes under `/account/`.
 */
import { INav } from "@/types/nav";

export const accountMenu: INav[] = [
	{
		title: "Account",
		url: "/account",
	},
	{
		title: "Dashboard",
		url: "/account/dashboard",
	},
	{
		title: "Templates",
		url: "/account/templates",
	},
	{
		title: "Addons",
		url: "/account/addons",
	},
	{
		title: "Organizations",
		url: "/account/organizations",
	},
	{
		title: "Credentials",
		url: "/account/credentials",
	},
	{
		title: "Starred",
		url: "/account/starred",
	},
];
