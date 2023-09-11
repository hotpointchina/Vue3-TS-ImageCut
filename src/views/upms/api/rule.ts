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
import { defHttp } from '/@/utils/axios';
import { RuleSaveParams } from '../model/rule';
enum Api {
  getRuleList = '/charity-system/api/pwo-rules/pages',
  ruleOnlyList = '/charity-system/api/pwo-rules/query/',
  addRule = '/charity-system/api/pwo-rules/add',
  editRule = '/charity-system/api/pwo-rules/edit/',
  deleteRule = '/charity-system/api/pwo-rules/remove',
  queryList = '/charity-system/api/sys-dict-items/queryList/', //规则类型
  publist = '/charity-system/api/pwo-rules/publish/'

}
// 分页查询
export const queryRule = (params) => {
  return defHttp.post({ url: Api.getRuleList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize, params });
};

// 新增
export const saveRule = (params: RuleSaveParams) => {
  return defHttp.post({ url: Api.addRule, params });
};

// 修改s
export const editRule = (params: RuleSaveParams) => {
  return defHttp.put({ url: Api.editRule + params.id, params });
};

// 删除

export const delRule = (params) => {
  return defHttp.delete({ url: Api.deleteRule, params });
};

// id查询
export const getOnlyRule = (id: string) => {
  return defHttp.get({ url: Api.ruleOnlyList + id });
};

// 规则类型查询
export const getRuleTypeList = (params) => {
  return sysHttp.get({ url: Api.queryList + params });
};

// 发布
export const publish = (id) => {
  return defHttp.get({ url: Api.publist + id });
};
