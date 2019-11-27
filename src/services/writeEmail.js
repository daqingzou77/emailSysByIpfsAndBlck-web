import { get, post } from '../utils/http';

/**
 *  提交邮件
 * @param data
 * @param successCb
 * @param failCb
 */
export const submitEmail = (data, successCb, failCb) => {
  post(`/writeEmail/submitEmail`, data, successCb, failCb);
}

/**
 *  获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBook = (data, successCb, failCb) => {
  get(`/writeEmail/getAddressBooks`, data, successCb, failCb);
}