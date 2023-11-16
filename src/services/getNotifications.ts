import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export interface GetNotificationsParams {
  page?: number;
}

export type GetNotificationsData = NotificationItem[];

export interface NotificationItem {
  id: number;
  member_id: number;
  for_member_id: number;
  text: string;
  payload: string;
  payload_rendered: string;
  created: number;
  member: {
    username: string;
  };
}

export default async function getNotifications({
  page = 1,
}: GetNotificationsParams): Promise<GetNotificationsData> {
  return fetcher.get('notifications', {
    params: { p: page },
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
