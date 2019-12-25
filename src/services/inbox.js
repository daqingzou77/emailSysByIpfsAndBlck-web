import { get, deletes, post } from '../utils/http';
import { success } from 'agentframework';

/**
 *  获取未读邮件列表
 * @param data
 * @param successCb
 * @param failCb
 */
export const getReceivingMails = (data, successCb, failCb) => {
  get(`/mail/receiving`, data, successCb, failCb);
}

/**
 * 获取已读邮件列表
 * @param  data 
 * @param  successCb 
 * @param  failCb 
 */
export const getRecivedMails = (data, successCb, failCb) => {
  get('/mail/received', data, successCb, failCb);
} 

/**
 *  查看邮件
 * @param data
 * @param successCb
 * @param failCb
 */
export const readMail = (data, successCb, failCb) => {
  get('/mail/read', data, successCb, failCb);
}

/**
 * 查看邮件附件
 */
export const catchMail = (data, successCb, failCb) => {
  post('/add/cat', data, successCb, failCb);
}