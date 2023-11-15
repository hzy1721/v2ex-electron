import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';
import { MemberInfo } from './getTopicInfo';

export interface GetTopicRepliesParams {
  topic: number;
  page?: number;
}

export type GetTopicRepliesData = ReplyItem[];

export interface ReplyItem {
  id: number;
  content: string;
  content_rendered: string;
  created: number;
  member: MemberInfo;
}

export default async function getTopicReplies({
  topic,
  page = 1,
}: GetTopicRepliesParams): Promise<GetTopicRepliesData> {
  return fetcher.get(`topics/${topic}/replies`, {
    params: { p: page },
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
