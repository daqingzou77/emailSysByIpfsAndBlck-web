import { post } from '../utils/http';
import { BaseUrl } from './baseUrl';

/**
 *  用户登录
 * @param dataBaseUrl
 * @param successCb
 * @param failCb
 */

export const userLogin = (data, successCb, failCb) => {
  post(`${BaseUrl}/user/userLogin`, data, successCb, failCb);
}

 /**
 *  用户注册
 * @param data
 * @param successCb
 * @param failCb
 */

 export const userRegister = (data, successCb, failCb) => {
   post(`${BaseUrl}/user/userRegister`, data, successCb, failCb);
 }