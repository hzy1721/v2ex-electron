import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';
import { NodeInfo } from './getNodeInfo';
import { TopicItem } from './getNodeTopics';

export interface GetTopicInfoParams {
  id: number;
}

export type GetTopicInfoData = TopicInfo;

export interface TopicInfo extends TopicItem {
  member: MemberInfo;
  node: NodeInfo;
  supplements: unknown[];
}

export interface MemberInfo {
  id: number;
  username: string;
  bio: string;
  website: string;
  github: string;
  url: string;
  avatar: string;
  created: number;
}

export default async function getTopicInfo({
  id,
}: GetTopicInfoParams): Promise<GetTopicInfoData> {
  return fetcher.get(`topics/${id}`, {
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
