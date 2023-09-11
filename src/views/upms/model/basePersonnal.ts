
export type editPageSubmitModal = 'add' | 'modify' | 'cancel';
// 列表实体
export interface UserListParams {
    id: string;
    username: string; //用户名
    nickname: string; //登录名称
    roleName: string[]; //角色
    mobile: string; //手机号
    email: string; //邮箱
    idNumber: string;//身份证号
    pwoName: string;
    role: string;
}

// 查询组类型
export interface Userparams {
  pageNum?: number;
  pageSize?: number;
  nickname?: string;
  pwoName?: string;
  pwoId?: string;
  role?: string;
  roleId?: string;

}

// 新增/编辑保存 
export interface UserSaveParams {
    id: string;
    pwoId: string;
    pwoName: string;
    username: string;
    nickname: string;//账号
    password: string;
    idNumber: string;
    roles?: string[];
    roleName?: string[];
    provinceName: string;
    cityName: string;
    countyName: string;
    provinceCode: string;
    cityCode: string;
    countyCode: string;
    mobile: string;
    email: string;
    orgName: string;// 机构
    orgCode: string;
    orgId: string;
    parentOrgCode?: string;
}


// 详情
export interface detaliParams {
    pwoName: string;
    username: string;
    nickname: string;//账号
    idNumber: string;
    roleName: string[];
    role: string;
    provinceName: string;
    cityName: string;
    countyName: string;
    mobile: string;
    email: string;
    orgName: string;
}

// 角色类型
export interface roleParams {
    value: string;
    label: string;
}
// 公益组织类型
export interface pwoParams {
    value: string;
    label: string;
}