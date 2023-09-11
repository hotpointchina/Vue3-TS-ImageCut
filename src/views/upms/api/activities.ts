import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
export const sysHttp = createAxios({
  requestOptions: {
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    isReturnNativeResponse: true,
  },
});

import { ActSaveParams, QueryParams } from '../model/activitiesModel';
/**
 * 枚举，访问路径
 */
enum Api {
  actLists = '/charity-system/api/pwo-activitiess/pages',
  actList = '/charity-system/api/pwo-activitiess/commit/pages',
  approval = '/charity-system/api/pwo-activitiess/approval/',
  actDel = '/charity-system/api/pwo-activitiess/remove',
  actDetail = '/charity-system/api/pwo-activitiess/query/',
  actEdit = '/charity-system/api/pwo-activitiess/edit/',
  actAdd = '/charity-system/api/pwo-activitiess/add',
  actChange = '/charity-system/api/pwo-activitiess/flagstatus/',
  statusUpdate = '/charity-system/api/pwo-activitiess/status/',
  submitcrowd = '/charity-system/api/pwo-activitiess/submitcrowd',
  donationRecords = '/charity-system/api/pwo-activitiess/donationRecord-list',
  crowddonation = '/charity-system/api/pwo-activitiess/crowddonation/',
}

/**
 * * 众筹活动申报
 */
export const actAdd = (params: ActSaveParams) => {
  return defHttp.post({ url: Api.actAdd, params });
};
/**
 * * 众筹活动提交
 */
export const submitcrowd = (params: ActSaveParams) => {
  return defHttp.post({ url: Api.submitcrowd, params });
};
/**
 * * 分页
 */
export const actLists = (params: QueryParams) => {
  return defHttp.post({ url: Api.actLists, params });
};
/**
 * * 分页 [已提交的]
 */
export const actList = (params: QueryParams) => {
  return defHttp.post({ url: Api.actList, params });
};

/**
 * * 审核记录查询
 */
export const approvalRecord = (id) => {
  return defHttp.post({ url: Api.approval + id });
};

/**
 *查询详情
 */
export const actDetail = (id) => {
  return sysHttp.get({ url: Api.actDetail + id });
};
/**
 * 众筹修改
 */
export const actEdit = (params: QueryParams) => {
  return defHttp.post({ url: Api.actEdit, params });
};
/**
 * 批量删除
 */
export const actDel = (params) => {
  return defHttp.post({ url: Api.actDel, params });
};
/**
 * 修改状态  statusUpdate
 */
export const statusUpdate = (id, params) => {
  return defHttp.post({ url: Api.statusUpdate + id, params });
};
/**
 * 修改审批状态
 * @param id
 * @param params
 */
export const actChange = (id, params) => {
  return defHttp.post({ url: Api.actChange + id, params });
};

/**
 * crowddonation 众筹捐赠情况查询
 */
export const crowddonation = (params) => {
  return defHttp.get({ url: Api.crowddonation, params });
};

/**
 * donationRecords 捐赠记录(分页)
 */
export const donationRecords = (params) => {
  return sysHttp.post({ url: Api.donationRecords, params });
};
