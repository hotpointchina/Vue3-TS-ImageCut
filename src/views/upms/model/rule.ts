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
export interface RuleQueryParams {
  pageNum: number;
  pageSize: number;
  ruleName: string;
  ruleType: string;
}
/**
 * 列表实体
 */
export interface RuleListParams {
  id?: string;
  ruleName: string;
  ruleCode: string;
  ruleLhs: string;
  ruleRns: string;
  ruleType: string;
  status: string;
  createTime: string
}
/**
 * 列表分页查询实体
 */
export type RulePageParams = BasicPageParams & {};
/**
 * 列表保存提交实体
 */
export interface RuleSaveParams {
  id?: string;
  ruleName: string;
  ruleSalience: string;
  ruleLhs: string;
  ruleRns: string;
  ruleType: string;
}
/**
 *列表返回实体
 */
export type RuleResult = BasicFetchResult<RuleListParams>;



