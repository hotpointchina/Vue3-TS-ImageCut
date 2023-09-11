/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-11 08:39:38
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-15 11:49:55
 * @FilePath: \gongyi_vue_demo\src\views\upms\api\user\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createAxios } from '/@/utils/axios';
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
enum Api {
  qryProject = '/project/', //项目列表
}
// 项目列表
export const GetProjectGroup = (params) => sysHttp.get({ url: Api.qryProject, params });

import { defHttp } from '/@/utils/axios';
/**
 * 引入model
 */
import { UserManyList } from '../../model/baseUserAdmin';
// import { or } from '@vueuse/core';

/**
 * 枚举，访问路径
 */
enum Api {
  userList = '/charity-system/api/users/pages',
  userDel = '/charity-system/api/users/remove',
  userDetail = '/charity-system/api/users/query/',
  userEdit = '/charity-system/api/users/edit/',
  userAdd = '/charity-system/api/users/add',
  userdownload = '/charity-system/api/file/download',
  imgDetail = '/charity-system/api/file/delete/',
  orgDataList = '/charity-system/org/pbd-orgs/pages', //机构名称
  updateRole = '/charity-system/api/sys-roles/user', //角色
  editStatus = '/charity-system/api/users/status', //启用禁用,
  // 公益组织查询机构
  gerOrgsList = '/charity-system/api/sys-users/get-orgs-list/',
  getOrganizes = '/charity-system/api/sys-organizes/options',
}

/**
 * * 新增人员
 */
export const saveUser = (params) => {
  return defHttp.post({ url: Api.userAdd, params });
};
/**
 * * 分页查询人员
 */
export const queryUser = (params: UserManyList) => {
  return defHttp.get({ url: Api.userList, params });
};

/**
 * * 查询人员详情
 */
export const detailUser = (orgId: string) => {
  return defHttp.get({ url: Api.userDetail + orgId });
};

/**
 * * 批量删除人员
 */
export const delUser = (params) => {
  return defHttp.post({ url: Api.userDel, params });
};

/**
 * * 修改人员
 */
export const editUser = (params) => {
  return defHttp.post({ url: Api.userEdit + params.id, params });
};
//下载头像
export const downloadImg = () => {
  return defHttp.get({ url: Api.userdownload });
};

// 删除头像
export const ImgDetail = (params) => {
  return defHttp.post({ url: Api.imgDetail + params });
};
// 机构列表
export const orgDataList = (params) => {
  return defHttp.get({ url: Api.orgDataList, params });
};

// 分配角色
export const updateRole = (pwoId, userId, params) => {
  return sysHttp.post({ url: Api.updateRole + '/' + pwoId + '/' + userId, params });
};
// 启用
export const editStatus = (userId, status) => {
  return defHttp.post({ url: Api.editStatus + '/' + userId + '/' + status });
};
// 公益组织查询机构
export const gerOrg = (pwoId) => {
  return sysHttp.get({ url: Api.gerOrgsList + pwoId })
}
// 查询所有组织
export const queryOrganize = () => {
  return sysHttp.get({ url: Api.getOrganizes })
}
