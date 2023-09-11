import { defHttp } from '/@/utils/axios';

/**
 * 枚举，访问路径
 */
enum Api {
    get = '/charity-system/api/sys-activity-spreads/list_admin', //查询
    add = '/charity-system/api/sys-activity-spreads/add', //新增
    delete = '/charity-system/api/sys-activity-spreads/remove/', //删除
    push = '/charity-system/api/sys-activity-spreads/publish',//发布
    getById='/charity-system/api/sys-activity-spreads/query/',
    getactive = '/charity-system/app-api/person-activitiess/activities-list',
    getactiveName = '/charity-system/app-api/pwo-name-addresss/nameaddress_list',
    setTop=' /charity-system/api/sys-activity-spreads/top/'
   
}

/** 查询所有*/
export const getData = () => {
    return defHttp.get({ url: Api.get});
};
/** byID*/
export const getById = (params) => {
    return defHttp.get({ url: Api.getById,params});
};
/** 查询活动*/
export const getActive = (params) => {
    return defHttp.post({ url: Api.getactive,params});
};
/** 查询活动*/
export const getActiveName = () => {
    return defHttp.post({ url: Api.getactiveName});
};


/** 删除*/
export const deleteData = (params) => {
    return defHttp.get({ url: Api.delete, params });
};
/** 新增*/
export const addData = (params) => {
    return defHttp.post({ url: Api.add, params, });
};
/** 启用、停用*/
export const pushData = (params) => {
    return defHttp.post({ url: Api.push, params });
};
/** 置顶*/
export const setTop = (params) => {
    return defHttp.get({ url: Api.setTop+params});
};