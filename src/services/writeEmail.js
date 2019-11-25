import { get, post } from '../utils/http';
import { BaseUrl } from './baseUrl';

/**
 *  提交邮件
 * @param data
 * @param successCb
 * @param failCb
 */
export const submitEmail = (data, successCb, failCb) => {
  post(`${BaseUrl}/writeEmail/submitEmail`, data, successCb, failCb);
}

/**
 *  获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBook = (data, successCb, failCb) => {
  get(`${BaseUrl}/writeEmail/getAddressBooks`, data, successCb, failCb);
}