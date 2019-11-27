import { get, post } from '../utils/http';

/**
 * 获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBooks = (data, successCb, failCb) => {
  get('/contact/query', data, successCb, failCb);
}

/**
 *  删除通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const deletesAddressBookByName = (data, successCb, failCb) => {
  get('/contact/delete', data, successCb, failCb);
}

/**
 *  提交通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const postAddressBook = (data, successCb, failCb) => {
   get('/contact/add', data, successCb, failCb);
}