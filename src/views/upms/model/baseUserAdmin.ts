import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 列表实体
 */
export interface UserListParams {
  id: string; //id
  username: string; //用户名
  nickname: string; //登录名称
  deptId: string; //机构ID
  orgName: string; //机构名称
  roleName: string[]; //角色
  role: string; //角色
  mobile: string; //手机号
  email: string; //邮箱
}
/**
 * 列表分页查询实体
 */
export type ReceivePageParams = BasicPageParams & {};
/**
 * 显示新增/修改页面
 */
export type editPageSubmitModal = 'add' | 'modify' | 'cancel';

/**

 * 列表保存提交实体/右侧表单

 */

export interface UserSaveParams {
  id: string;
  org: string;
  username: string;
  nickname?: string;
  password: string;
  cardNo: string;
  role?: string;
  roleName: [];
  provinceName: string;
  cityName: string;
  countyName: string;
  provinceCode: string;
  cityCode: string;
  countyCode: string;
  mobile: string;
  email: string;
  status: string;
  avatar: string;
  pwoId?: string;
}

export interface responseAPI {
  records: UserListParams[];
  code: number;
  message: string;
  current: number;
  pageSize: number;
  total: number;
}
/**

 *列表返回实体

 */

export type SenderResult = BasicFetchResult<UserListParams>;

// 查询组类型
export interface UserManyList {
  nickname?: string;
  orgName?: string;
  orgCode?: string;
  pageNum: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
  role: string;
  roleId: string;
}
//角色下拉框
export interface roleManyList {
  name: string;
  id: string;
}
