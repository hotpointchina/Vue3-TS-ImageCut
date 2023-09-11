/*
 * @Author: zhangwanrong
 * @Date: 2022-12-15 14:06:30
 * @LastEditors: zhangwanrong
 * @LastEditTime: 2022-12-20 14:18:41
 * @Description: file content
 * @FilePath: \chinapost_charity_vue\src\views\upms\api\donation.ts
 */
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
import { CrowdSaveParams } from '../model/crowdactivitiesModel';
enum Api {
  activitysList = '/charity-system/api/pwo-activitiess/pages', //分页查询
  activitysOnlyList = '/charity-system/api/pwo-activitiess/query', //查询详情
  addActivitys = '/charity-system/api/pwo-activitiess/add', //新增
  editActivitys = '/charity-system/api/pwo-activitiess/edit/', //修改
  deleteActivitys = '/charity-system/api/pwo-activitiess/remove', //删除
  statusEdit = '/charity-system/api/pwo-activitiess/status/', //禁/启用
  //条件查询
  conditionQuery = '/charity-system/api/pwo-activitiess/getcrowd',
  // 审批记录
  approval = '/charity-system/api/pwo-activitiess/approval/',
  // 修改提交审批状态
  flagstatusEdit = '/charity-system/api/pwo-activitiess/flagstatus/',
  //查询项目编号项目名称
  getactivity = '/charity-system/api/pwo-activitiess/getNumAndName',
  //活动发布
  publishing = '/charity-system/api/pwo-activitiess/flagstatus/',
  //捐赠情况
  getDonations = '/charity-system/api/pwo-activitiess/crowddonation',
  // 富文本上传图片
  importImg = '/charity-system/api/files/uploadImage',
  upload = '/charity-system/api/files/upload',
  //提交
  activitySubmit = '/charity-system/api/pwo-activitiess/submitcrowd',
  addProduct = '/charity-system/api/pwo-activities-schedules/add',
}

// 活动查询所有
export const queryActivitys = (params) => {
  return defHttp.post({
    url: Api.activitysList,
    params,
  });
};
//筛选查询
export const queryCondition = (params) => {
  return defHttp.post({
    url: Api.conditionQuery,
    params,
  });
};
//项目查询
export const queryUnit = (params) => {
  return defHttp.post({
    url:
      Api.getactivity + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};
//活动发布
export const eventRelease = (id, params) => {
  return defHttp.post({
    url: Api.publishing + id,
    params,
  });
};

// id查询详情
export const getOnlyActivitys = (id: string) => {
  return defHttp.get({ url: Api.activitysOnlyList + '/' + id });
};

// 新增
export const saveActivitys = (params: CrowdSaveParams) => {
  return defHttp.post({ url: Api.addActivitys, params });
};
// 提交
export const activitySubmit = (params) => {
  return defHttp.post({ url: Api.activitySubmit, params });
};
// 修改
export const editAddress = (params: CrowdSaveParams) => {
  return defHttp.post({ url: Api.editActivitys + params.id, params });
};

// 删除

export const delActivitys = (params) => {
  return defHttp.post({ url: Api.deleteActivitys, params });
};

// 状态修改

export const editStatus = (id: string, params) => {
  return defHttp.post({ url: Api.statusEdit + id, params });
};

// 审批记录

export const getApprovaList = (id: string) => {
  return defHttp.get({ url: Api.approval + id });
};

// 修改审批状态
export const editFlagstatus = (id: string, params) => {
  return defHttp.post({ url: Api.flagstatusEdit + id, params });
};
// 捐赠情况
export const donations = (params) => {
  return defHttp.post({ url: Api.getDonations, params });
};
// 富文本上传图片
export const uploadFile = (params) => {
  return sysHttp.post({ url: Api.importImg, params });
};

export const upload = (params) => {
  return sysHttp.post({ url: Api.importImg, params });
};

// 进度维护新增
export const addProduct = (params) => {
  return sysHttp.post({ url: Api.addProduct, params });
};
