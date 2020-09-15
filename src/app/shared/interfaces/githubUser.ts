export interface GithubUser {
  login: string;
  id: number,
  node_id: string,
  avatar_url: string;
  url: string,
  html_url: string,
  created_at: string;
  location: string;
  bio: string;
  name: string
  followers: number,
  following: number;
  repos_url: string
  public_repos: string;
  public_gists: string;
  message: string
}
