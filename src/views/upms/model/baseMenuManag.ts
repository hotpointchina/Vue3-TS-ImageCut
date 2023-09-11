import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 查询实体
 */
export interface MenuQueryParams {
  pageNum: number;
  pageSize: number;
  name: string;
  type: string;
  visible: string;
  activitiesStartTime: string;
  activitiesEndTime: string;
}

/**
 * 列表实体
 */
export interface MenuListParams {
  id: string;
  label: string;
  createTime: string;
  status: string; //状态
  btnPerm: string; //权限字符串
  component: string;
  type: string;
  typeName: string;
  path: string;
  permStr: string;
  children: [];
}

/**
 * 列表分页查询实体
 */
export type TypePageParams = BasicPageParams & {};

/**
 * 列表保存提交实体
 */
export interface FormMenuType {
  /**
   * 菜单ID
   */
  id: string;
  /**
   * 父菜单ID
   */
  parentId: number;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 菜单是否可见(1:是;0:否;)
   */
  visible: string;
  // icon?: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 路由路径
   */
  path: string;
  /**
   * 跳转路由路径
   */
  redirect?: string;

  /**
   * 菜单类型
   */
  type: string;

  /**
   * 权限标识
   */
  permPath?: string;
  /**
   * 路由路径
   */
  urlPerm: string;
  /**
   * 请求方式
   */
  method: string;
  label: string;
  permStr: string;
}

/**
 *列表返回实体
 */
export type TypeResult = BasicFetchResult<MenuListParams>;
