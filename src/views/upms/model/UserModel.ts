/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-10 11:50:04
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-12-01 16:56:00
 * @FilePath: \gongyi_vue_demo\src\views\upms\model\UserModel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface UserQueryParams {
    pageNum: any;
    pageSize: any;
    orgId?: number;
    isAdmin?: number;
    status?: string;
    pbdCode?: string;
    pbdName?: string;
    isDeleted?: number;
    version?: number;
    orgCode?: string;
    orgName?: string;
    loginCode?: string;
    userName?: string;
    phone?: string;
    sex?: number;
    avatar?: string;
    password?: string;
}
/**
 * 列表实体
 */
export interface UserListParams {
    orgId?: number;
    isAdmin?: number;
    status?: string;
    pbdCode?: string;
    pbdName?: string;
    isDeleted?: number;
    version?: number;
    orgCode?: string;
    remark?: string;
    orgName?: string;
    loginCode?: string;
    userName?: string;
    phone?: string;
    sex?: number;
    avatar?: string;
    password?: string;
}
/**
 * 列表分页查询实体
 */
export type UserPageParams = BasicPageParams & {
                                                                                }
/**
 * 列表保存提交实体
 */
export interface UserSaveParams {
    org:string;
    username: string;
    nickname?:string;
    password:string;
    cardNo:string;
    role:string;
    provinceName:string;
    cityName:string;
    countyName:string;
    provinceCode:string;
    cityCode:string;
    countyCode:string;
    mobile:string;
    email:string;
    status:string;
    avatar:string;
    }
/**
 *列表返回实体
 */
export type UserResult = BasicFetchResult<UserListParams>;