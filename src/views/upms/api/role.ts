import { defHttp } from '/@/utils/axios';
import { createAxios } from '/@/utils/axios';
// export const sysPreFix = 'zmock';
export const sysHttp = createAxios({
    requestOptions: {
        // apiUrl: sysPreFix,
        isTransformResponse: false,
        joinParamsToUrl: false,
        joinTime: false,
        isReturnNativeResponse: true
    },
});
import { formType } from '../model/roleModel';
enum Api {
    getRoleList = '/charity-system/api/sys-roles/pages',
    addRole = '/charity-system/api/sys-roles/add',
    editRole = '/charity-system/api/sys-roles/edit/',
    deleteRole = '/charity-system/api/sys-roles/delete/',
    roleOnlyList = '/charity-system/api/sys-roles/query/',


    // 查询所有组织
    getOrganize = '/charity-system/api/sys-organizes/options',

    // 获取所有的权限
    getMenuList = '/charity-system/api/menus/resources',
    // 根据角色获取对应的权限
    getMenuIds = '/charity-system/api/sys-roles/menuIds/',
    // 分配权限
    updateMenus = '/charity-system/api/sys-roles/menus/'

}
// 查询所以组织
export const queryOrganize = () => {
    return defHttp.get({ url: Api.getOrganize })
}
// 分页查询
export const queryRoles = (params) => {
    return defHttp.post({ url: Api.getRoleList + '?pageNum=' + params.pageNum + '&pageSize=' + params.pageSize, params });
};

// 新增
export const saveRoles = (params: formType) => {
    return sysHttp.post({ url: Api.addRole, params });
};

// 修改
export const editRole = (params: formType) => {
    return sysHttp.post({ url: Api.editRole + params.id, params });
};

// 删除

export const delRole = (id) => {
    return sysHttp.post({ url: Api.deleteRole + id });
};

// id查询
export const getOnlyRole = (id: string) => {
    return defHttp.get({ url: Api.roleOnlyList + id });
};

// 获取所有权限
export const getjurisdiction = () => {
    return defHttp.get({ url: Api.getMenuList })
}

// 根据角色获取对应权限
export const getRoleMenuIds = (id) => {
    return defHttp.get({ url: Api.getMenuIds + id })
}

// 分配权限
export const updateRoleMenus = ( id, params) => {
    return defHttp.post({ url: Api.updateMenus + id, params })
}
