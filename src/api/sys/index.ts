/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 10:19:04
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-08 16:58:31
 * @FilePath: \gongyi_vue_demo\src\api\sys\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { defHttp, createAxios } from '/@/utils/axios';
import {
  LoginData, LoginParams, responseLoginInfo,
  // menuParams
} from '/@/api/model/User';
import { UserReturn } from '/#/store';


enum Api {
  SESSION_TIMEOUT = '/user/sessionTimeout',
  TOKEN_EXPIRED = '/user/tokenExpired',
  // LOGIN = '/_user/login',
  // LOGIN = '/oauth/token',
  GetMenuList = '/charity-system/v1/home/menu/user-menu/123',
  LOGIN = '/charity-system/v1/login',
  USER_INFO = '/charity-system/v1/user/info/123',
  Logout = '/sso/server-logout',
}

// Get personal center-basic settings

export const userLogin = (params: LoginParams) =>
  // defHttp.post<LoginResultModel>(
  //   { url: `${Api.LOGIN}?${JsonToUrl(user)}` , user},
  //   { joinParamsToUrl: true, isTransformResponse: false },
  // );
  defHttp.post({ url: Api.LOGIN, params });
// export const getMenus = (params: menuParams) => {
//   return defHttp.get({ url: Api.GetMenuList, params });
// };

export const getUserInfo = () => {
  return defHttp.get<UserReturn>({ url: Api.USER_INFO });
};

export const sessionTimeoutApi = () => defHttp.post<void>({ url: Api.SESSION_TIMEOUT });

export const tokenExpiredApi = () => defHttp.post<void>({ url: Api.TOKEN_EXPIRED });

export const userLogout = () => defHttp.post({ url: Api.Logout });


export const sysHttp = createAxios({
  requestOptions: {
    apiUrl: '',
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isEncryptionPostBody: true,
  },
});
export const sysLogin = createAxios({
  requestOptions: {
    apiUrl: '',
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: true,
    isEncryptionPostBody: false,
  },
});
const requestWithCode = createAxios({
  requestOptions: {
    apiUrl: '',
    isReturnNativeResponse: true,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isEncryptionPostBody: true,
  },
});


/**
 * 获取图片验证码
 */
export const getCaptcha = () => {
  return sysHttp.get({ url: '/captcha?t=' + new Date().getTime().toString() });
};

/**
 * 登录
 * @param data
*/
export function login(params: LoginData) {
  const data = JSON.stringify({data:params});
  return sysLogin.post({ url:'/charity-system/auth/login', data });
}
export function logout() {
  return requestWithCode.post({ url:'/charity-system/auth/logout' });
}

// 获取登录用户的 信息
export const landingUserInfo = () => {
  return requestWithCode.get({
    url: '/charity-system/api/sys-users/me',
  });
};

// 获取菜单
export const getMenus = async () => {
  const res: responseLoginInfo = await sysHttp.get({
    url: '/charity-system/api/menus/routes',
  });
  return res.result;
};

export interface formType {
  id?: string;
  name: string;
  pwoName?: string;
  pwoId?: string;
  code: string;
}
export const testSaveRoles = (params: formType) => {
  return sysHttp.post({ url: '/charity-system/api/sys-roles/addTest', params });
};
