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
/**
 * 引入model
 */
import { ItemSaveParams } from '../model/dictItemModel';
import { TypeQueryParams } from '../model/dictTypeModel';
/**
 * 枚举，访问路径
 */
enum Api {
  itemList = '/charity-system/api/sys-dict-items/pages',
  itemDel = '/charity-system/api/sys-dict-items/remove',
  itemDetail = '/charity-system/api/sys-dict-items/query/',
  itemEdit = '/charity-system/api/sys-dict-items/edit/',
  itemAdd = '/charity-system/api/sys-dict-items/add',
  dictChange = '/charity-system/api/sys-dict-items/statusUpdate?id=',
  queryList = '/charity-system/api/sys-dict-items/queryList/',
  queryDicList = '/charity-system/api/sys-dict-items/queryDicList/',
}
/**
 * * 新增字典数据
 */
export const saveItem = (params: ItemSaveParams) => {
  return defHttp.post({ url: Api.itemAdd, params });
};

/**
 * * 查询字典数据
 */
export const queryItem = (params: TypeQueryParams) => {
  return defHttp.post({ url: Api.itemList, params });
};
/**
 * * 查询字典数据详情
 */
export const detailItem = (id: string) => {
  return defHttp.get({ url: Api.itemDetail + id });
};
/**
 * * 删除字典数据
 */
export const delItem = (params) => {
  return defHttp.delete({ url: Api.itemDel, params });
};
/**
 * * 修改字典数据
 */
export const editItem = (params: ItemSaveParams) => {
  return defHttp.post({ url: Api.itemEdit + params.id, params });
};

/**
 * * 修改字典类型
 */
export const editItemStatus = (id, status) => {
  return defHttp.post({ url: Api.dictChange + id + '&status=' + status });
};
/**
 *
 * @param typeCode
 */
export const queryList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryList + typeCode });
};
/**
 *
 * @param typeCode
 */
export const queryDicList = (typeCode: string) => {
  return sysHttp.get({ url: Api.queryDicList + typeCode });
};
