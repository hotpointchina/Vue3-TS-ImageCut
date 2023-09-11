/*
 * @Author: fanzhiwei
 * @Date: 2023.3.27
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { createAxios, defHttp } from '/@/utils/axios';
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
import {
  ActivitiesQueryParams,
} from '../model/crowdFundingApproveModel';

/**
 * 枚举，访问路径
 */
enum Api {
  activitiesList = '/charity-system/api/pwo-activitiess/commit/pages',
  activitiesDel = '/charity-system/api/pwo-activitiess/query/',
  approveAgree = '/charity-system/api/pwo-activitiess/agree',
  approvereject = '/charity-system/api/pwo-activitiess/reject',
  approvalList = '/charity-system/api/pwo-activitiess/approval/'
}

/**
 * * 众筹活动审批通过
 */
export const approveAgree = (params: any) => {
  return sysHttp.post({ url: Api.approveAgree, params });
};
/**
 * * 众筹活动审批驳回
 */
export const queryActivities = (params: ActivitiesQueryParams) => {
  return defHttp.post({ url: Api.activitiesList, params });
};

/**
 * * 查询众筹活动详情
 */
export const detailActivities = (id: number) => {
  return defHttp.get({ url: Api.activitiesDel + id });
};

/**
 * * 驳回
 */
export const approvereject = (params: any) => {
  return defHttp.post({ url: Api.approvereject, params });
};

// 审批记录
export const getApprovalList = (id) => {
  return defHttp.get({ url: Api.approvalList + id });
};

