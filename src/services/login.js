import { post } from '../utils/http';

/**
 *  用户登录
 * @param dataBaseUrl
 * @param successCb
 * @param failCb
 */

export const userLogin = (data, successCb, failCb) => {
  post(`/api/users/login`, data, successCb, failCb);
}

 /**
 *  用户注册
 * @param data
 * @param successCb
 * @param failCb
 */

 export const userRegister = (data, successCb, failCb) => {
   post(`/api/users/register`, data, successCb, failCb);
 }