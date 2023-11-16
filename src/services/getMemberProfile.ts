import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export type GetMemberProfileParams = never;

export type GetMemberProfileData = MemberProfile;

export interface MemberProfile {
  id: number;
  username: string;
  url: string;
  website: string | null;
  twitter: string | null;
  psn: string | null;
  github: string | null;
  btc: string | null;
  location: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_mini: string;
  avatar_normal: string;
  avatar_large: string;
  avatar_xlarge: string;
  avatar_xxlarge: string;
  avatar_xxxlarge: string;
  created: number;
  last_modified: number;
}

export default async function getMemberProfile(): Promise<GetMemberProfileData> {
  return fetcher.get(`member`, {
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
