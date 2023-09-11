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
import { TypeQueryParams, TypeSaveParams } from '../model/dictTypeModel';

/**
 * 枚举，访问路径
 */
enum Api {
  typeList = '/charity-system/api/sys-dict-types/pages',
  typeDel = '/charity-system/api/sys-dict-types/remove/',
  typeDetail = '/charity-system/api/sys-dict-types/query/',
  typeEdit = '/charity-system/api/sys-dict-types/edit',
  typeAdd = '/charity-system/api/sys-dict-types/add',
  dictChange = '/charity-system/api/sys-dict-types/statusUpdate?id=',
}

/**
 * * 新增字典类型
 */
export const saveType = (params: TypeSaveParams) => {
  return defHttp.post({ url: Api.typeAdd, params });
};

/**
 * * 查询字典类型
 */
export const queryType = (params: TypeQueryParams) => {
  return defHttp.post({ url: Api.typeList, params });
};

/**
 *状态变更
 * @param id
 * @param status
 */
export const dictTypeChange = (id, status) => {
  return defHttp.post({ url: Api.dictChange + id + '&status=' + status });
};
/**
 * * 查询字典类型详情
 */
export const detailType = (id: string) => {
  return defHttp.get({ url: Api.typeDetail + id });
};

/**
 * * 删除字典类型
 */
export const delType = (id: string) => {
  return defHttp.delete({ url: Api.typeDel + id });
};

/**
 * * 修改字典类型
 */
export const editType = (params: TypeSaveParams) => {
  return defHttp.post({ url: Api.typeEdit, params });
};
