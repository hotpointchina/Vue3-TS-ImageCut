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
enum Api {
  qryProject = '/project/', //项目列表
}
// 项目列表
export const GetProjectGroup = (params) => sysHttp.get({ url: Api.qryProject, params });

import { defHttp } from '/@/utils/axios';
/**
 * 引入model
 */
// import { AddressListParams } from '../../model/doneeModel';
// import { or } from '@vueuse/core';

/**
 * 枚举，访问路径
 */
enum Api {
  doneeList = '/charity-system/api/pwo-name-addresss/pages',
  doneeDel = '/charity-system/api/pwo-name-addresss/remove/',
  doneeDetail = '/charity-system/api/pwo-name-addresss/query/',
  doneeEdit = '/charity-system/api/pwo-name-addresss/edit/',
  doneeAdd = '/charity-system/api/pwo-name-addresss/add',
  //   doneedownload = '/charity-system/api/file/download',
  //   imgDetail = '/charity-system/api/file/delete/',
  doneesubmit = '/charity-system/api/pwo-name-addresss/submit/', //提交
  batchDel = '/charity-system/api/pwo-name-addresss/batchRemove', //批量删除
  batchSubmit = '/charity-system/api/pwo-name-addresss/batchSubmit', //批量提交
  queryList = '/charity-system/api/sys-dict-items/queryList/', //搜索框状态
  query ='/charity-system/api/pwo-name-addresss/approve/pages',
  doneeDownload = '/charity-system/api/files/download', //图片下载
  imgUPload = '/charity-system/api/files/upload', //图片上传
  doneeStatus = '/charity-system/api/pwo-name-addresss/change', //停启用
  doneeRelease = '/charity-system/api/pwo-name-addresss/issue/', //发布
  approvalRecord = '/charity-system/api/pwo-activitiess/approval/', //审核记录
  approve = '/charity-system/api/pwo-name-addresss/approve/'

}

/**
 *
 * @param id
 */
const dataTime = Date.now();
export const approve = (id,params) => {
  return defHttp.post({ url: Api.approve + id +`?_t=${dataTime}`,params });
};

/**
 * * 搜索框状态
 */
export const queryList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryList + typeCode });
};
/**
 * * 列表查询
 */
export const doneeList = (params) => {
  return defHttp.post({ url: Api.doneeList, params });
};


export const query = (params) => {
  return sysHttp.post({ url: Api.query, params });
};

/**
 * * 新增
 */
const dataTimeAdd = Date.now();
export const doneeAdd = (params) => {
  return defHttp.post({ url: Api.doneeAdd + `?_t=${dataTimeAdd}`, params });
};
/**
 * * 编辑
 */
export const doneeEdit = (params) => {
  return defHttp.post({
    url: Api.doneeEdit + params.id + `?_t=${dataTimeAdd}`,
    params,
  });
};
/**
 * * 查看
 */
export const doneeDetail = (orgId: string) => {
  return defHttp.get({ url: Api.doneeDetail + orgId });
};
/**
 * * 审核记录
 */
export const approvalRecord = (orgId: string) => {
  return defHttp.get({ url: Api.approvalRecord + orgId });
};
/**
 * * 删除
 */
export const doneeDel = (orgId: string) => {
  return defHttp.get({ url: Api.doneeDel + orgId });
};
/**
 * * 提交
 */
export const doneesubmit = (orgId: string) => {
  return defHttp.get({ url: Api.doneesubmit + orgId + `?_t=${dataTimeAdd}` });
};
/**
 * * 批量提交
 */
export const batchSubmit = (params) => {
  return defHttp.post({ url: Api.batchSubmit + `?_t=${dataTimeAdd}`, params });
};
/**
 * * 批量删除
 */
export const batchDel = (params) => {
  return defHttp.post({ url: Api.batchDel, params });
};
/**
 * * 图片下载
 */
export const doneeDownload = (params) => {
  return sysHttp.get({
    url: Api.doneeDownload + '?filePath=' + params,
    responseType: 'blob',
  });
};
/**
 * * 停启用
 */
export const doneeStatus = (params) => {
  return sysHttp.post({
    url: Api.doneeStatus + `?_t=${dataTimeAdd}`,
    params,
  });
};
/**
 * * 发布
 */
export const doneeRelease = (id: string) => {
  return sysHttp.get({
    url: Api.doneeRelease + id,
  });
};
/**
 * * 图片上传
 */
export const doneeUpload = (params) => {
  return sysHttp.post({
    url: Api.imgUPload,
    params,
  });
};
export const getBase64 = (data, type) => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([data], { type: type }); // 必须指定type类型
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
