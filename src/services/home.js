import { get, post } from '../utils/http';


/**
 * 获取显示信息
 * @param {*} data 
 * @param {*} successCb 
 * @param {*} failCb 
 */
export const getChainInfo = (data, successCb, failCb) => {
  get('/api/chain/info', data, successCb, failCb);
}

/**
 * 获取区块列表信息
 * @param data
 * @param successCb
 * @param failCb
 */
export const getBlockInfos = (data, successCb, failCb) => {
  get('/api/chain/blocks', data, successCb, failCb);
}

/**
 * 获取最新几笔交易数
 * @param data
 * @param successCb
 * @param failCb
 */
export const getNewTrasactions = (data, successCb, failCb) => {
  get(`/api/chain/ltxs`, data, successCb, failCb);
}

/**
 * 查看邮件详情
 * @param data
 * @param successCb
 * @param failCb
 */
export const getEmailDeatilByTxId = (data, successCb, failCb) => {
  get(`/api/chain/tx`, data, successCb, failCb);
}

/**
 * 查看邮件附件
 */
export const catchMail = (data, successCb, failCb) => {
  post('/api/ipfs/get', data, successCb, failCb);
}