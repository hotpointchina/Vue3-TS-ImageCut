import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
// export const sysPreFix = 'zmock';
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
 * 引入model
 */
import { ProblemQueryParams, ProblemSaveParams } from '../model/problem';

/**
 * 枚举，访问路径
 */
enum Api {
  problemList = '/charity-system/api/common-problems/pages',
  problemDel = '/charity-system/api/common-problems/remove',
  problemDetail = '/charity-system/api/common-problems/query/',
  problemEdit = '/charity-system/api/common-problems/edit/',
  problemAdd = '/charity-system/api/common-problems/add',
  problemSele = '/charity-system/api/sys-dict-items/queryList/',
  prpblemStatus = '/charity-system/api/common-problems/status/',
}

/**
 * * 新增常见问题管理
 */
export const saveProblem = (params: ProblemSaveParams) => {
  return defHttp.post({ url: Api.problemAdd, params });
};
/**
 * * 查询常见问题管理
 */
export const queryProblem = (params: ProblemQueryParams) => {
  return defHttp.post({ url: Api.problemList, params });
};

/**
 * * 查询常见问题管理详情
 */
export const detailProblem = (params) => {
  return defHttp.get({ url: Api.problemDetail + params });
};

/**
 * * 删除常见问题管理
 */
export const delProblem = (params) => {
  return defHttp.delete({ url: Api.problemDel, params });
};

/**
 * * 修改常见问题管理
 */
export const editProblem = (params: ProblemSaveParams) => {
  return defHttp.put({ url: Api.problemEdit + params.id, params });
};
/**
 * * 停用启用常见问题管理
 */
export const statusProblem = (params) => {
  return defHttp.post({ url: Api.prpblemStatus + params.id, params });
};
//字典接口
export const seleProblem = (id: string) => {
  return sysHttp.get({ url: Api.problemSele + id });
};
