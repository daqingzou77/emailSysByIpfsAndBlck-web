import { get } from '../utils/http';


/**
 * 获取显示信息
 * @param {*} data 
 * @param {*} successCb 
 * @param {*} failCb 
 */
export const getChainInfo = (data, successCb, failCb) => {
  get('/chain/info', data, successCb, failCb);
}

/**
 * 获取最新几笔交易数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getNewTrasactions = (data, successCb, failCb) => {
  get(`/users/getNewTrasactions`, data, successCb, failCb);
}

/**
 * 查看邮件详情
 * @param data
 * @param successCb
 * @param failCb
 */
export const getEmailDeatilByHash = (data, successCb, failCb) => {
  get(`/users/getEmailDeatilByHash`, data, successCb, failCb);
}