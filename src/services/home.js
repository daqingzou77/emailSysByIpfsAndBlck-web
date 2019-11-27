import { get } from '../utils/http';

/**
 *  获取用户数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getUsers = (data, successCb, failCb) => {
  get(`/users/getUser`, data, successCb, failCb);
}


/**
 * 获取区块节点数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getNodes = (data, successCb, failCb) => {
  get(`/users/getNodes`, data, successCb, failCb);
}

/**
 * 获取区块高度
 * @param data
 * @param successCb
 * @param failCb
 */
export const getBlocksHeight = (data, successCb, failCb) => {
  get(`/users/getBlocksHeight`, data, successCb, failCb);
}
  
/**
 * 获取交易数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getTrasactions = (data, successCb, failCb) => {
  get(`/users/getTrasactions`, data, successCb, failCb);
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