/**
 * GitHub API types.
 *
 * `IGitHubUser` — subset of the GitHub REST API user object used to populate
 * public profile pages (`GET /users/{username}`).
 */
export interface IGitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}
