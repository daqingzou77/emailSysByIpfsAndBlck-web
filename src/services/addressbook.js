import { get, post, deletes, put } from '../utils/http';
import { BaseUrl } from '../config/config';

/**
 * 获取通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBooks = (data, successCb, failCb) => {
  get(`${BaseUrl}/addressbook/getAddressBooks`, data, successCb, failCb);
}

/**
 *  查看通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const getAddressBookByName = (data, successCb, failCb) => {
  get(`${BaseUrl}/addressbook/getAddressBookByName`, data, successCb, failCb);
}

/**
 *  修改通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const updateAddressBook = (data, successCb, failCb) => {
    put(`${BaseUrl}/addressbook/updateAddressBook`, data, successCb, failCb);
  }

/**
 *  删除通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const deletesAddressBookByName = (data, successCb, failCb) => {
  deletes(`${BaseUrl}/addressbook/deletesAddressBookByName`, data, successCb, failCb);
}

/**
 *  提交通讯录
 * @param data
 * @param successCb
 * @param failCb
 */
export const postAddressBook = (data, successCb, failCb) => {
   post(`${BaseUrl}/addressbook/postAddressBook`, data, successCb, failCb);
  }