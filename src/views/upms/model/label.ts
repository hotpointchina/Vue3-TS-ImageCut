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
export interface LabelQueryParams {
    pageNum: number;
    pageSize: number;
    labelName?: string;
    parentLabelName?: string;
    labelLevel?: string;
}
/**
 * 列表实体
 */
export interface LabelListParams {
    id?: string;
    labelName?: string;
    labelLevel?: string;
    parentLabelName?: string;
    status?: string;
    remark?: string;
}
// 新增或编辑
export interface LabelSaveParams {
    id?: string;
    labelName?: string;
    labelLevel?: string;
    parentLabelName?: string;
    parentLabelCode?: string;
}
/**
 * 列表分页查询实体
 */
export type LabelPageParams = BasicPageParams & {};

/**
 *列表返回实体
 */
export type LabelResult = BasicFetchResult<LabelListParams>;
