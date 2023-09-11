import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * 查询实体
 */
export interface ProblemQueryParams {
  pageNum: number;
  pageSize: number;
  questionHead?: string;
  questionType?: string;
  questionLevel?: string;
  questionDescrible?: string;
  status?: string;
  solution?: string;
}
/**
 * 列表实体
 */
export interface ProblemListParams {
  id?: string;
  remark?: string;
  questionHead?: string;
  questionType?: string;
  questionLevel?: string;
  questionDescrible?: string;
  status?: string;
  solution?: string;
  createTime?: string;
}
/**
 * 列表分页查询实体
 */
export type ProblemPageParams = BasicPageParams & {};
/**
 * 列表保存提交实体
 */
export interface ProblemSaveParams {
  id?: string;
  createBy?: number;
  createTime?: string;
  updateBy?: number;
  updateTime?: string;
  remark?: string;
  questionHead?: string;
  questionType?: string;
  questionLevel?: string;
  questionDescrible?: string;
  status?: string;
  solution?: string;
  isDeleted?: number;
  version?: number;
}
/**
 *列表返回实体
 */
export type ProblemResult = BasicFetchResult<ProblemListParams>;
