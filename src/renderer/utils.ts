import { message } from 'antd';

export function errorPrompt(error: any) {
  let str = String(error);
  if (typeof error?.message === 'string') {
    str = error.message;
  }
  message.error(str);
}
