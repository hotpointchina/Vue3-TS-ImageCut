import { RoleInfo } from '/#/user';

export interface User {
  available: string; // 是否正常 0锁定 1正常
  availableText: string; // 是否正常 0锁定 1正常
  avatar: string; // 头像地址
  deptId: string; // 机构id
  deptName: string; // 机构名称
  description: string; // 描述
  email: string; // 邮箱
  id: string; // 用户id
  nickName: string; // 昵称
  parentDeptId: string; // 父机构id
  password: string; // 密码
  phone: string; // 手机号
  roleIdList: string[]; // 角色id列表
  roleList: any[]; // 角色列表
  roleNames: string; // 角色名称
  type: string; // 类型
  username: string; // 用户名
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export interface UserReturn {
  deptAvliable: boolean;
  needRestPassword: boolean;
  permissions: string[];
  user: UserInfo;
  isSystemAdmin: Boolean;
}

export interface UserInfo {
  id: string | number;
  token: string;
  name?: string;
  realName?: string;
  needRestPassword?: boolean;
  permissionList?: string[] | number[];
  avatar?: string;
  desc?: string;
  homePath?: string;
  roleList?: RoleInfo[];
  tenantId?: string;
  projectId?: string;
  isSystemAdmin: Boolean;
  deptName?: string;

  perms?: string[];
  roles?: string[];
  nickname?: string;
  username: string;
  orgCode?: string;
  orgName: string;
  userId?: string;
}

//header 租户和项目信息
export interface HeaderTenantProject {
  tenantId?: string;
  tenantName?: string;
  projectId?: string;
  projectName?: string;
}

// 用户字典信息
export interface Dict {
  label: string;
  value: string;
}
export interface ResDict {
  [code: string]: Dict[];
}
