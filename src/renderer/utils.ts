import { message } from 'antd';

export function errorPrompt(error: string) {
  message.error(error);
}
