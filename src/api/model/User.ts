export interface LoginParams {
  userName: string;
  userPasswd: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  expires_in: number;
  // license: string;
  // refresh_token: string;
  // scope: string;
  // token_type: string;
}

export interface menuParams {
  tenantId?: string;
  projectId?: string;
  isAll: Boolean; // 是否展示全部菜单 false 展示启用的，true展示全部
}



// 登录请求的 入参
export interface LoginData {
  username: string;
  password: string;
  grant_type?: string;
  code: string;
  uuid: string;
}

interface refreshToken{
  expiration: string,
  value: string,
}
export interface resLoginData {
  access_token: string;
  token_type: string;
  deptId: string;
  expires_in: number;
  jti: string;
  refresh_token: refreshToken | string;
  scope?: string;
  userId: string;
  username: string;
}

export interface authTokenData {
  access_token: string;
  token_type: string;
  deptId: string;
  expires_in: number;
  jti: string;
  refresh_token: refreshToken | string;
  scope?: string;
  userId: string;
  username: string;
}
export interface authTokenModal {
  authToken: string;
}
// 登录成功的响应信息
export interface responseLoginInfo {
  code: string;
  mse: string;
  result: authTokenModal | string;
}
// 退出成功的响应信息
export interface responseLoginOutInfo {
  code: string;
  mse: string;
  result: string;
  status?: number;
}
export interface natureResponseLoginInfo {
  config: object;
  data: responseLoginInfo;
  headers: object;
  request: object;
  status: number;
  statusText: string;
}

interface responseUserResult {
  id: string;
  name: string;
  orgName: string;
  avatar: string;
  roles: string[],
  perms: string[],
}
// 登录成功后响应的用户信息
export interface responseUserInfo {
  code: string;
  msg: string;
  result: responseUserResult;
}
// 登录成功后响应的用户信息
export interface responseWithCodeUserInfo {
  config:Object,
  headers:Object,
  request:Object,
  data:responseUserInfo,
  status: number,
  statusText: string,
}



export type voidFunction = () => void;
