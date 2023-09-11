import {createAxios, defHttp} from '/@/utils/axios';

/**
 * 引入model
 */

import { OrgQueryParams, OrgSaveParams } from '../model/pbdOrgModel';

export const sysHttp = createAxios({
  requestOptions: {
    // apiUrl: sysPreFix,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});
/**
 * 枚举，访问路径
 */
enum Api {
  orgList = '/charity-system/org/pbd-orgs/pages',
  orgDel = '/charity-system/org/pbd-orgs/remove',
  orgDetail = '/charity-system/org/pbd-orgs/query/',
  orgEdit = '/charity-system/org/pbd-orgs/edit/',
  orgAdd = '/charity-system/org/pbd-orgs/add',
  usedChange = '/charity-system/org/pbd-orgs/statusUpdate/',
  queryOrgList = '/charity-system/org/pbd-orgs/list',
  queryOrg = '/charity-system/org/pbd-orgs/queryOrg',
  queryChildOrg = '/charity-system/org/pbd-orgs/queryChildOrg/',
  queryUpdateOrgList = '/charity-system/org/pbd-orgs/queryUpdateOrgList/',
  queryOrgByOrg = '/charity-system/org/pbd-orgs/queryOrgByOrg',
  queryList = '/charity-system/api/sys-dict-items/queryList/',
}

/**
 * * 新增机构
 */
export const saveOrg = (params: OrgSaveParams) => {
  return defHttp.post({ url: Api.orgAdd, params });
};

/**
 * * 查询机构
 */
export const queryOrg = (params: OrgQueryParams) => {
  return defHttp.post({ url: Api.orgList, params });
};

/**
 * * 查询机构详情
 */
export const detailOrg = (id: string) => {
  return defHttp.get({ url: Api.orgDetail + id });
};

export const queryList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryList + typeCode });
};

/**
 * * 删除机构
 */
export const delOrg = (params) => {
  return defHttp.post({ url: Api.orgDel, params });
};
/**
 * * 修改机构
 */
export const editOrg = (params: OrgSaveParams) => {
  return sysHttp.post({ url: Api.orgEdit + params.id, params });
};
/**
 *机构停用，启用
 */
export const useChange = (id, status) => {
  return defHttp.post({ url: Api.usedChange + id + '/' + status });
};

export const queryOrgTree = () => {
  return defHttp.post({ url: Api.queryOrg });
};

export const queryChildOrgTree = (code: string) => {
  return defHttp.get({ url: Api.queryChildOrg + code });
};

export const queryUpdateOrgList = (parentOrgCode: string) => {
  return defHttp.post({ url: Api.queryUpdateOrgList + parentOrgCode });
};

export const queryOrgByOrg = (params: OrgQueryParams) => {
  return defHttp.post({ url: Api.queryOrgByOrg, params });
};
