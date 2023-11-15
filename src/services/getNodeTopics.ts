import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export interface GetNodeTopicsParams {
  node: string;
  page?: number;
}

export type GetNodeTopicsData = TopicItem[];

export interface TopicItem {
  id: number;
  title: string;
  content: string;
  content_rendered: string;
  syntax: number;
  url: string;
  replies: number;
  last_reply_by: string;
  created: number;
  last_modified: number;
  last_touched: number;
}

export default async function getNodeTopics({
  node,
  page = 1,
}: GetNodeTopicsParams): Promise<GetNodeTopicsData> {
  return fetcher.get(`nodes/${node}/topics`, {
    params: { p: page },
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
