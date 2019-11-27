import { get, deletes } from '../utils/http';

/**
 *  获取邮件列表
 * @param data
 * @param successCb
 * @param failCb
 */
export const getMailList = (data, successCb, failCb) => {
  get(`/inbox/getMailList`, data, successCb, failCb);
}

/**
 *  查看邮件详情
 * @param data
 * @param successCb
 * @param failCb
 */
export const findMailById = (data, successCb, failCb) => {
  get(`/inbox/findMailByUser`, data, successCb, failCb);
}

/**
 *  删除邮件
 * @param data
 * @param successCb
 * @param failCb
 */
export const deleteMailByuser = (data, successCb, failCb) => {
  deletes(`/inbox/deleteMailByuser`, data, successCb, failCb);
}