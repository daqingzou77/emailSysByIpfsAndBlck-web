import { get } from '@/utils/http';

export const querySent = (data, successCb, failCb) => {
  get('/mail/sent', data, successCb, failCb)
}