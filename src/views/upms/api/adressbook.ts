/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-12-05 10:08:36
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-12-09 16:03:46
 * @FilePath: \gongyi_vue_demo\src\views\upms\api\adressbook.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//名址信息管理
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
export const requestWithCode = createAxios({
  requestOptions: {
    apiUrl: '',
    isReturnNativeResponse: true,
    isTransformResponse: false,
    joinParamsToUrl: false,
    joinTime: false,
    // POST 请求 body体是否加密
    isEncryptionPostBody: false,
  },
});
/**
 * 引入model
 */
// import {
//     AdressSaveParams,
//     AdressManyList
// } from '../model/baseAdressbook';
// import { or } from '@vueuse/core';

/**
 * 枚举，访问路径
 */
enum Api {
  userList = '/charity-pbo/api/nameaddresss/pages', //查询所有
  userDel = '/charity-pbo/api/nameaddresss/remove', //批量删除
  userDetail = '/charity-pbo/api/nameaddresss/query/', //修改页面回显
  userEdit = '/charity-pbo/api/nameaddresss/edit/', //修改
  userAdd = '/charity-pbo/api/nameaddresss/add', //添加
  userState = '/charity-pbo/api/nameaddresss/status/', //禁/启用
  userSubmit = '/charity-pbo/api/nameaddresss/bathsubmit', //批量提交
  getProduct = '/charity-pbo/api/donateactivitys/getproduct/pages', //查询所有项目编号项目名称
  getunits = '/charity-pbo/api/nameaddresss/getunits/pages', //查询所有单位编号单位名称
  getproductCode = '/charity-pbo/api/pwoproducts/getproduct/pages', //查询所有产品编号产品名称
  nameaddList = '/charity-pbo/api/name-address-submits/pages', //名址管理我的申请分页
  nameDetail = '/charity-pbo/api/nameaddresss/query/line-id/pages', //
  nameOneMany = '/charity-pbo/api/name-address-submits/query/', //我的申请单条详情
  nameOneManyQuery = '/charity-pbo/api/nameaddresss/commit/line-id', //我的申请单条查询详情
  nameDetailAddList = '/charity-pbo/api/name-address-submits/add', //详情新增
  importList = '/charity-pbo/api/nameaddresss/importsXls', //批量导入
  downloadXlsx = '/charity-pbo/api/nameaddresss/exportstemplate', //下载
  nameDel = '/charity-pbo/api/nameaddresssubmits/remove', //详情删除
  submitPage = '/charity-pbo/api/nameaddresss/commit/pages', //批量提交显示页
  detailSubimt = '/charity-pbo/api/unitsinfo/query-units/', //通过条件查询详情
  queryList = '/charity-system/api/sys-dict-items/queryList/', //搜索框状态
  // 通过单位code查省市县
  unitInfo = '/charity-pbo/api/unitsinfo/query-units/',
  //提交回显
  submitEcho = '/charity-pbo/api/name-address-submits/query/get-detail/',
  //待办我的申请显示列表
  applyforList = '/charity-pbo/api/nameaddresss/query-code/pages',
}

/**
 * * 新增人员
 */
export const saveUser = (params) => {
  return defHttp.post({ url: Api.userAdd, params });
};
/**
 * * 查询所有
 */
export const queryUser = (params) => {
  return defHttp.post({
    url: Api.userList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};

/**
 * * 修改页面回显
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
/**
 * * 修改状态
 */
export const editState = (params) => {
  return defHttp.post({ url: Api.userState + params.id, params });
};
/**
 * * 批量提交
 */
export const submitState = (params) => {
  return defHttp.post({ url: Api.userSubmit, params });
};
/**
 * * 查询所有项目编号项目名称
 */
export const getProduct = (params) => {
  return defHttp.post({
    url: Api.getProduct + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};
/**
 * * 查询所有单位编号单位名称
 */
export const getunits = (params) => {
  return defHttp.post({ url: Api.getunits, params });
};
/**
 * * 查询所有产品编号产品名称
 */
export const getproductCode = (params) => {
  return defHttp.post({ url: Api.getproductCode, params });
};
/**
 * * 名址提交
 */
// export const setSubmit = (params) => {
//   return defHttp.post({ url: Api.setSubmit, params });
// };
/**
 * * 名址管理我的申请分页
 */
export const nameaddList = (params) => {
  return defHttp.post({
    url:
      Api.nameaddList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};
/**
 * * 名址管理我的申请查看功能(项目名称 产品名称 名址类型 单位名称必填 寄件人姓名和身份证号选填)
 */
export const nameDetail = (params) => {
  return defHttp.post({ url: Api.nameDetail, params });
};
/**
 * * 我的申请单条详情
 */
export const nameOneMany = (id: string) => {
  return defHttp.get({ url: Api.nameOneMany + id });
};
/**
 * * 我的申请单条查询详情
 */
export const nameOneManyQuery = (params) => {
  return defHttp.post({ url: Api.nameOneManyQuery, params });
};
/**
 * * 详情新增
 */
export const nameDetailAddList = (params) => {
  return defHttp.post({ url: Api.nameDetailAddList, params });
};
/**
 * * 批量导入
 */
export const importList = (params) => {
  console.log('批量导入 importList');
  return requestWithCode.post({ url: Api.importList, params, responseType: 'blob' });
};
/**
 * * 下载xlsx
 */
export const downloadXlsx = () => {
  return sysHttp.get({ url: Api.downloadXlsx, responseType: 'blob' });
};
/**
 * * 详情删除
 */
export const nameDel = (params) => {
  return defHttp.post({ url: Api.nameDel, params });
};
/**
 * * 批量提交显示页
 */
export const submitPage = (params) => {
  return defHttp.post({
    url: Api.submitPage + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};
/**
 * * 通过条件查询详情
 */
export const detailSubimt = (orgId) => {
  return defHttp.get({
    url: Api.detailSubimt + orgId,
  });
};
/**
 * * 搜索框状态
 */
export const queryList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryList + typeCode });
};
// 通过单位code查省市县
export const unitInfos = (code) => {
  return sysHttp.get({ url: Api.unitInfo + code });
};
//提交回显
export const submitEcho = (orgId: string) => {
  return sysHttp.get({ url: Api.submitEcho + orgId });
};
//待办我的申请显示列表
export const applyforList = (params) => {
  return sysHttp.post({
    url:
      Api.applyforList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize,
    params,
  });
};
