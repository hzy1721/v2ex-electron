import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export interface GetNodeInfoParams {
  name: string;
}

export type GetNodeInfoData = NodeInfo;

export interface NodeInfo {
  id: number;
  url: string;
  name: string;
  title: string;
  header: string;
  footer: string;
  avatar: string;
  topics: number;
  created: number;
  last_modified: number;
}

export default async function getNodeInfo({
  name,
}: GetNodeInfoParams): Promise<GetNodeInfoData> {
  return fetcher.get(`nodes/${name}`, {
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
