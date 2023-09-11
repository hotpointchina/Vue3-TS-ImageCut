import { defHttp } from '/@/utils/axios';

/**
 * 枚举，访问路径
 */
enum Api {
  userList = '/charity-system/api/menus/list', //查询所有树
  useisrLt = '/charity-system/api/menus/pages', //根据树查询一二级表
  userMenu = ' /charity-system/api/menus/addMenu', //新增一二级树
  deletMenu = '/charity-system/api/menus/delete/', //删除一二级表
  detailMenu = '/charity-system/api/menus/', //一二级查看详情
  editMenu = '/charity-system/api/menus/update/', //修改 一二级
  useBtnList = '/charity-system/api/sys-permissions/pages', //分页查询三级
  addBtn = '/charity-system/api/sys-permissions/add', //三级
  deleteBtn = '/charity-system/api/sys-permissions/remove', //三级
  editBtn = '/charity-system/api/sys-permissions/edit/', //三级
  detailBtn = '/charity-system/api/sys-permissions/query/', //三级
  menuTree = '/charity-system/api/menus/list',
  treeTable = '/charity-system/api/menus/list', //查询所有+条件查询
  getParentTree = '/charity-system/api/menus/options', //新增下拉框父级菜单
  addTable = '/charity-system/api/menus/add', //新增
  editTable = '/charity-system/api/menus/edit/', //修改
  deleteTable = '/charity-system/api/menus/remove/', //删除
  detailTable = '/charity-system/api/menus/', //详情
}

/** 顶级菜单接口*/
export const getMenuTree = () => {
  return defHttp.get({
    url: Api.menuTree,
  });
};
/** 查询所有*//**条件查询*/
export const treeTableMenu = (params) => {
  return defHttp.post({ url: Api.treeTable,params });
};
/** 新增下拉框父级菜单*/
export const getParentTree = () => {
  return defHttp.get({
    url: Api.getParentTree,
  });
};
/** 新增*/
export const addTable = (params) => {
  return defHttp.post({
    url: Api.addTable,
    params,
  });
};
/** 删除*/
export const deleteTable = (id: string) => {
  return defHttp.post({
    url: Api.deleteTable + id,
  });
};
/** 修改*/
export const editTable = (id: string, params) => {
  return defHttp.post({
    url: Api.editTable + id,
    params,
  });
};
/** 查询详情*/
export const detailTable = (id: string) => {
  return defHttp.get({
    url: Api.detailTable + id,
  });
};
/**
 * * 查询所有树
 */
export const getTreeMenu = () => {
  return defHttp.get({
    url: Api.userList,
  });
};
/**
 * * 根据树查询一二级表
 */
export const getMenuForm = (params) => {
  return defHttp.post({
    url: Api.useisrLt,
    params,
  });
};
/**
 * * 新增一二级树
 */
export const addMenu = (params) => {
  return defHttp.post({
    url: Api.userMenu,
    params,
  });
};
/**
 * * 删除一二级树
 */
export const deleteMenuForm = (id: string) => {
  return defHttp.post({
    url: Api.deletMenu + id,
  });
};
/**
 * * 一二级树查看详情
 */
export const detailMenuForm = (id: string) => {
  return defHttp.get({
    url: Api.detailMenu + id,
  });
};
/**
 * * 修改一二级树
 */
export const editMenuForm = (id: string) => {
  return defHttp.get({
    url: Api.editMenu + id,
  });
};
/**
 * * 查看三级
 */
export const getBtnForm = (params) => {
  return defHttp.post({
    url: Api.useBtnList,
    params,
  });
};
/**
 * * 增三级
 */
export const addBtnForm = (params) => {
  return defHttp.post({
    url: Api.addBtn,
    params,
  });
};
/**
 * * 删三级
 */
export const deleteBtnForm = (params) => {
  return defHttp.post({
    url: Api.deleteBtn,
    params,
  });
};
/**
 * * 改三级
 */
export const editBtnForm = (params) => {
  return defHttp.post({
    url: Api.editBtn + params.id,
    params,
  });
};
/**
 * * 三级详情
 */
export const detailBtnForm = (params) => {
  return defHttp.get({
    url: Api.detailBtn,
    params,
  });
};
