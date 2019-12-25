import { get, post } from '@/utils/http';

/**
 * 获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const querySent = (data, successCb, failCb) => {
  get('/api/mail/sent', data, successCb, failCb)
}

/**
 * 获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const catchMail = (data, successCb, failCb) => {
  post('/add/cat', data, successCb, failCb);
}