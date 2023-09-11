import { defHttp } from '/@/utils/axios';

/**
 * 枚举，访问路径
 */
enum Api {
    // 商品列表
    get = '/charity-system/api/pwo-waress/pages', //查询
    getById='/charity-system/api/pwo-waress/query/',//byid
    add = '/charity-system/api/pwo-waress/add', //新增
    edit = '/charity-system/api/pwo-waress/edit/',//编辑
    delete = '/charity-system/api/pwo-waress/remove/', //删除
    deleteList = '/charity-system/api/pwo-waress/batchRemove',//批量删除
    startOrEnd = '/charity-system/api/pwo-waress/change',//停用启用
    // 商品规格 列表
    specsAdd = '/charity-system/api/pwo-wares-infos/add',
    specsDelete = '/charity-system/api/pwo-wares-infos/remove/',
    specsStartOrEnd  = '/charity-system/api/pwo-wares-infos/change',
}

/** 查询所有*/
export const getData = (params) => {
    return defHttp.post({ url: Api.get,params});
};
/** byID*/
export const getById = (params) => {
    return defHttp.get({ url: Api.getById,params});
};
/** 新增*/
export const addData = (params) => {
    return defHttp.post({ url: Api.add, params, });
};
/** 修改*/
export const editData = (params) => {
    return defHttp.post({ url: Api.edit+params.id, params, });
};
/** 删除*/
export const deleteData = (params) => {
    return defHttp.get({ url: Api.delete,params });
};
/** 删除*/
export const deleteListData = (params) => {
    return defHttp.post({ url: Api.deleteList,params });
};
/** 启用停用*/
export const startOrEndData = (params) => {
    return defHttp.post({ url: Api.startOrEnd, params });
};
// 商品规格
/** 新增*/
export const specsAddData = (params) => {
    return defHttp.post({ url: Api.specsAdd,params });
};
/** 删除*/
export const specsDeleteData = (params) => {
    return defHttp.get({ url: Api.specsDelete,params});
};
/** 停用启用*/
export const specsStartOrEndData = (params) => {
    return defHttp.post({ url: Api.specsStartOrEnd,params });
};