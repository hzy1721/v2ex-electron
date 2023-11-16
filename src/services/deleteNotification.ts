import { AUTH_SERVICE } from './auth';
import fetcher from './fetcher';

export interface DeleteNotificationParams {
  id: number;
}

export type DeleteNotificationData = void;

export default async function deleteNotification({
  id,
}: DeleteNotificationParams): Promise<DeleteNotificationData> {
  return fetcher.delete(`notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${AUTH_SERVICE.pat}`,
    },
  });
}
