import { IUser } from "@/types/user";

export async function fetchMe(): Promise<IUser> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("unauthenticated");

  return res.json();
}
