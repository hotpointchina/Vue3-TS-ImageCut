import { defHttp, createAxios } from '/@/utils/axios';
import { sm2Encrypt } from '/@/utils/helper/crypto';
export const sysHttp = createAxios({
  requestOptions: {
    // apiUrl: sysPreFix,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true
  },
});
/**
 * 枚举，访问路径
 */
enum Api {
  possWordupdate = '/charity-system/api/sys-users/upPassword', //密码修改
  personViewupdate = '/charity-system/api/sys-users/edit/', //信息修改
  PersonnalOnlyList = '/charity-system/api/sys-users/query/',//个人信息
  editPersonnal = '/charity-system/api/sys-users/edit/',//编辑
}


export const sysLogin = createAxios({
  requestOptions: {
    apiUrl: '',
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: true,
    isEncryptionPostBody: false,
  },
});
// 登录请求的 入参
export interface PassWordData {
  username: string;
  oldPasswd:string;
  password: string;
  newPassword: string;
}
/** 修改密码*/
export function passWordUpdate(params: PassWordData) {
  const data = JSON.stringify({ data: params });
  return sysLogin.post({ url: Api.possWordupdate, data });
}
/** 修改信息*/
export const personViewUpdate = (params) => {
  return defHttp.post({ url: Api.personViewupdate + params.id, params, });
};
export function PassWordUpdate(val: PassWordData) {
  const { username,oldPasswd, password, newPassword } = val;
  let sendData: any = JSON.stringify({
    username: username.trim(),
    oldPasswd:oldPasswd,
    password: password,
    newPassword: newPassword,
  });
  sendData = sm2Encrypt(sendData);
  console.log(sendData)
  passWordUpdate(sendData);

}

// id查询单条
export const getOnlyPersonnal = (id: string) => {
  return sysHttp.get({url: Api.PersonnalOnlyList + id});
};
// 修改
export const editPersonnal = (params) => {
  return sysHttp.post({url: Api.editPersonnal + '/' + params.id, params});
};
