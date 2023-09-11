import {createAxios} from '/@/utils/axios';
// export const sysPreFix = 'zmock';
export const sysHttp = createAxios({
  requestOptions: {
    // apiUrl: sysPreFix,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true
  },
});
import {UserSaveParams} from '../model/basePersonnal';

enum Api {
  getOrganizes = '/charity-system/api/sys-organizes/options',
  // getRoles = '/charity-system/api/sys-roles/options/',
  getRoles = '/charity-system/api/sys-roles/checkbox/',

  // 下拉角色 查询所有角色
  getAllRoles = '/charity-system/api/sys-roles/options',
  getPersonnal = '/charity-system/api/sys-users/pages',
  addPersonnal = '/charity-system/api/sys-users/add',
  editPersonnal = '/charity-system/api/sys-users/edit/',
  deletePersonnal = '/charity-system/api/sys-users/remove',
  PersonnalOnlyList = '/charity-system/api/sys-users/query/',
  resetPassword = '/charity-system/api/sys-users/resetpwd/',
  // 分配角色
  updateRole = '/charity-system/api/sys-roles/user',
  // 公益组织查询机构
  gerOrgsList = '/charity-system/api/sys-users/get-orgs-list/',
  tradePagePay = '/charity-system/api/ali-pay/trade/pay',
}

// 查询所有组织
export const queryOrganize = () => {
  return sysHttp.get({url: Api.getOrganizes})
}
// 查询所有角色
export const queryRole = (pwoId, userId) => {
  return sysHttp.get({url: Api.getRoles + pwoId + '/' + userId})
}
// 下拉
export const getAllRole = () => {
  return sysHttp.get({url: Api.getAllRoles})
}
// 分页查询
export const queryPersonnal = (params) => {
  return sysHttp.post({url: Api.getPersonnal + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize, params});
}
// id查询单条
export const getOnlyPersonnal = (id: string) => {
  return sysHttp.get({url: Api.PersonnalOnlyList + id});
};
// 新增
export const savePersonnal = (params: UserSaveParams) => {
  return sysHttp.post({url: Api.addPersonnal, params});
};
// 删除
export const delPersonnal = (params) => {
  return sysHttp.post({url: Api.deletePersonnal, params});
};
// 修改
export const editPersonnal = (params: UserSaveParams) => {
  return sysHttp.post({url: Api.editPersonnal + '/' + params.id, params});
};
// 重置密码
export const resetPwd = (id: string) => {
  return sysHttp.post({url: Api.resetPassword + id});
};
// 分配角色
export const updateRole = (pwoId,userId, params) => {
  return sysHttp.post({url: Api.updateRole + '/' + pwoId + '/' + userId, params})
}
// 公益组织查询机构
export const gerOrg = (pwoId) => {
  return sysHttp.get({url: Api.gerOrgsList + pwoId})
}
export const tradePagePay = () => {
  return sysHttp.post({url: Api.tradePagePay})
}




