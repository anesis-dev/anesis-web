
export interface ISession {
  login: string;
  avatar_url: string;
  role: "admin" | "user";
  is_current: boolean;
}
