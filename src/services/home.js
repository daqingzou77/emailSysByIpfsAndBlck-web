import { get } from '../utils/http';
import { BaseUrl } from './baseUrl';

/**
 *  获取用户数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getUsers = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getUser`, data, successCb, failCb);
}


/**
 * 获取区块节点数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getNodes = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getNodes`, data, successCb, failCb);
}

/**
 * 获取区块高度
 * @param data
 * @param successCb
 * @param failCb
 */
export const getBlocksHeight = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getBlocksHeight`, data, successCb, failCb);
}
  
/**
 * 获取交易数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getTrasactions = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getTrasactions`, data, successCb, failCb);
}

/**
 * 获取最新几笔交易数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getNewTrasactions = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getNewTrasactions`, data, successCb, failCb);
}

/**
 * 查看邮件详情
 * @param data
 * @param successCb
 * @param failCb
 */
export const getEmailDeatilByHash = (data, successCb, failCb) => {
  get(`${BaseUrl}/users/getEmailDeatilByHash`, data, successCb, failCb);
}