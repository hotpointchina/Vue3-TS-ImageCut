/*
 * @Author: 作者
 * @Date: 创建日期
 * @LastEditTime: 最后一次修改时间
 * @LastEditors: 最后修改人
 * @Description: 描述，每次修改补充修改内容
 * @FilePath:
 */
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface UserQueryParams {
  pageNum: number;
  pageSize: number;
  validStartTime?: string;
  validEndTime?: string;
  username?: string;
  gmtCreated?: string;
  orgName?: string;
}
/**
 * 列表实体
 */
export interface UserListParams {
  userId?: number;
  username?: string;
  gmtCreated?: string;
  gmtModified?: string;
  orgCode?: string;
  orgName?: string;
  wechatMobile?: string;
  wechatNickname?: string;
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
  validStartTime?: string;
  validEndTime?: string;
  isLock?: string;
  passwordUpdateTime?: string;
  loginDate?: string;
  qrCode?: string;
  merchantNo?: string;
  createUserId?: number;
  username?: string;
  gmtCreated?: string;
  modifyUserId?: number;
  gmtModified?: string;
  isDeleted?: string;
  orgCode?: string;
  orgName?: string;
  openid?: string;
  wechatMobile?: string;
  wechatNickname?: string;
  password?: string;
  saltValue?: string;
  uid?: string;
  mobile?: string;
  merchantId?: number;
  loginFailureTimes?: number;
  lockTime?: string;
  isAdmin?: string;
}
/**
 *列表返回实体
 */
export type UserResult = BasicFetchResult<UserListParams>;
