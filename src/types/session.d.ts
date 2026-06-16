/**
 * Session type.
 *
 * Represents one entry in the multi-account session list returned by
 * `GET /user/sessions`. `is_current` is `true` for the active account.
 */
export interface ISession {
  login: string;
  avatar_url: string;
  role: "admin" | "user";
  is_current: boolean;
}
