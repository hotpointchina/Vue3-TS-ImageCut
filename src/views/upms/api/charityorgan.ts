/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { defHttp } from '/@/utils/axios';
/**
 * 引入model
 */
/**
 * 枚举，访问路径
 */
enum Api {
  //新增公益组织
  add = '/charity-system/api/sys-organizes/add',
  //列表查询
  getOrgan = '/charity-system/api/sys-organizes/pages',
  //编辑
  editOrgan = '/charity-system/api/sys-organizes/edit',
  //删除公益组织
  deleteOrgan = '/charity-system/api/sys-organizes/remove',
  //删除公益组织校验
  deleteOrganCheck = '/charity-system/api/sys-organizes/remove',
  // 省
  proList = '/charity-system/api/amc-districts/queryPro',
  // 市
  cityList = '/charity-system/api/amc-districts/queryCity/',
  // 县
  countyList = '/charity-system/api/amc-districts/queryCounty/',
  // 获取授权资源
  getrangeOrgan = '/charity-system/api/sys-roles/checkbox',
  //公益组织授权
  rangeOrgan = ' /charity-system/api/sys-roles/pwo',
  // 公益组织授权
  // rangeOrgan = '/charity-system/api/sys-roles/pwo/menus',
  // 获取授权资源
  // getrangeOrgan = '/charity-system/api/menus/resources',
  //停用公益组织
  // stopOrgan = '/charity-system/api/sys-organizes/statusUpdate',
  // 授权回显
  // getrangeOrganOk = '/charity-system//api/sys-roles/pwo/menuIds',

}

/**列表查询*/
export const getOrgan = (params) => {
  return defHttp.get({ url: Api.getOrgan + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize });
};
/**条件查询*/
export const getSearch = (params) => {
  return defHttp.get({ url: Api.getOrgan + '?pageNum=1&pageSize=10' + '&provinceName=' + params.provinceName + '&cityName=' + params.cityName + '&countyName=' + params.countyName + '&pwoCode=' + params.pwoCode + '&pwoName=' + params.pwoName });
};
/**新增*/
export const postadd = (params) => {
  return defHttp.post({ url: Api.add, params });
};
/**删除*/
export const deleteOrgan = (params) => {
  return defHttp.post({ url: Api.deleteOrgan, params });
};
/**删除校验*/
export const deleteOrganCheck = (params) => {
  return defHttp.post({ url: Api.deleteOrgan + '/' + params });
};
/** 编辑*/
export const editOrgan = (params) => {
  return defHttp.post({ url: Api.editOrgan + '/' + params.id, params });
};
/** 获取组织机构*/
export const getrangeOrgan = (id) => {
  return defHttp.get({ url: Api.getrangeOrgan + '/' + id });
};
1/** 授权*/
export const rangeOrgan = (id, params) => {
  return defHttp.post({ url: Api.rangeOrgan + '/' + id, params });
};
/**省 */
export const queryPro = () => {
  return defHttp.get({ url: Api.proList })
}
/**市*/
export const queryCity = (code) => {
  return defHttp.get({ url: Api.cityList + code })
}
/**县*/
export const queryCounty = (code) => {
  return defHttp.get({ url: Api.countyList + code })
}
// /**
//  * * 停用
//  */
// export const stopOrgan = (params) => {
//   return defHttp.post({ url: Api.stopOrgan + '?id=' + params.id + '&status=' + params.status });
// };
// /**
//  * 已授权组织数据回显
//  *
//  */
// export const getrangeOrganOk = (id) => {
//   return defHttp.get({ url: Api.getrangeOrganOk + '/' + id });
// };


