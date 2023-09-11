import { defHttp } from '/@/utils/axios';

/**
 * 枚举，访问路径
 */
enum Api {
  List = '/charity-system/api/pay-ments/pages', //查询
  add = '/charity-system/api/pay-ments/add', //新增
  delete = ' /charity-system/api/pay-ments/remove/', //删除
}

/** 查询所有*//**条件查询*/
export const Table = (params) => {
  return defHttp.post({ url: Api.List,params });
};
/** 新增*/
export const addData = (params) => {
  return defHttp.post({url: Api.add,params,});
};
/** 删除*/
export const deleteTable = (params) => {
  return defHttp.post({ url: Api.delete,params});
};