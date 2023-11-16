import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export type GetPatInfoParams = void;

export type GetPatInfoData = PatInfo;

export interface PatInfo {
  token: string;
  scope: string;
  expiration: number;
  good_for_days: number;
  total_used: number;
  last_used: number;
  created: number;
}

export default async function getPatInfo(): Promise<GetPatInfoData> {
  return fetcher.get(`token`, {
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
