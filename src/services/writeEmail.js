import { get, post } from '../utils/http';

/**
 *  提交邮件
 * @param data
 * @param successCb
 * @param failCb
 */
export const submitEmail = (data, successCb, failCb) => {
  post('/api/mail/send', data, successCb, failCb);
}

/**
 *  获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBook = (data, successCb, failCb) => {
  get('/api/contact/query', data, successCb, failCb);
}