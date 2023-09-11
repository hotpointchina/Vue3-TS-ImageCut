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
export interface AddressQueryParams {
  pageNum: number;
  pageSize: number;
  id?: string;
  startTime?: string;
  endTime?: string;
  applyStatus?: string;
  type?: string;
  doneeName?: string;
  status?: string;
  createTime?: any;
}
/**
 * 列表实体
 */
export interface AddressListParams {
  id?: string;
  phoneNumber?: string;
  status?: string;
  applyStatus?: string;
  applyTime?: string;
  type?: string;
  doneeName?: string;
  sex?: string;
  age?: string;
  countyCode?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  doneeAddr?: string;
  idCard?: string;
  urgentName?: string;
  urgentRelation?: string;
  urgentPhone?: string;
  doneeStartTime?: string;
  doneeEndTime?: string;
  doneeCycle?: string;
  doneeTarget?: string;
  doneeExplain?: string;
  doneeIntroduce?: string;
  idCardMsg?: string | string[];
  doneeMsg?: string | string[];
  applyPeople?: string;
  provinceCode?: string;
  cityCode?: string;
  frontID?: string; //身份证正面
  reverseID?: string; //身份证正面
  suggestMsg?: string | string[];
}
/**
 * 列表分页查询实体
 */
export type AddressPageParams = BasicPageParams & {};
/**
 * 列表保存提交实体
 */
export interface AddressSaveParams {
  countyCode?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  doneeAddr?: string;
  phoneNumber?: string;
  idCard?: string;
  urgentName?: string;
  urgentRelation?: string;
  urgentPhone?: string;
  doneeStartTime?: string;
  doneeEndTime?: string;
  doneeCycle?: string;
  doneeTarget?: string;
  doneeExplain?: string;
  doneeIntroduce?: string;
  idCardMsg?: string | string[];
  doneeMsg?: string | string[];
  applyPeople?: string;
  applyTime?: string;
  doneeName?: string;
  sex?: string;
  age?: string;
  type?:string;
  provinceCode?: string;
  cityCode?: string;
  frontID?: string; //身份证正面
  reverseID?: string; //身份证正面
  suggestMsg?: string | string[];
}

export interface AddressParams {
  countyCode?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  doneeAddr?: string;
  phoneNumber?: string;
  idCard?: string;
  urgentName?: string;
  urgentRelation?: string;
  urgentPhone?: string;
  doneeStartTime?: string;
  doneeEndTime?: string;
  doneeCycle?: string;
  doneeTarget?: string;
  doneeExplain?: string;
  doneeIntroduce?: string;
  idCardMsg?: string[];
  doneeMsg?: string[];
  applyPeople?: string;
  applyTime?: string;
  doneeName?: string;
  sex?: string;
  age?: string;
  type?:string;
  provinceCode?: string;
  cityCode?: string;
  frontID?: string; //身份证正面
  reverseID?: string; //身份证正面
  suggestMsg?: string[];
}
/**
 *列表返回实体
 */
export type AddressResult = BasicFetchResult<AddressListParams>;

/* 查看列表详情 */
export interface AddressDetailParams {
  doneeName?: string;
  sex?: string;
  age?: string;
  provinceName?: string;
  cityName?: string;
  countyName?: string;
  doneeAddr?: string;
  phoneNumber?: string;
  type?: string;
  urgentName?: string;
  urgentRelation?: string;
  urgentPhone?: string;
  doneeCycle?: string;
  doneeTarget?: string;
  applyStatus?: string;
  status?: string;
  doneeExplain?: string;
  doneeIntroduce?: string;
  idCardMsg?: string;
  doneeMsg?: string;
}
//记录
export interface recordType {
  id: string;
  checkName?: string;
  checkOpinion?: string;
  checkStatus?: string;
  createTime?: string;
  approverOrg: string;
  //   approverOpinion: string;
  //   approverResult: string;
  approverName?: string;
  approverOpinion?: string;
  approverResult?: string;
}
