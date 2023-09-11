import { defHttp } from '/@/utils/axios';

import {
    LabelQueryParams, LabelSaveParams
} from '../model/label';
enum Api {
    labelList = '/charity-system/api/sys-labels/pages',
    addLabel = '/charity-system/api/sys-labels/add',
    editLabel = '/charity-system/api/sys-labels/edit/',
    labelDetail = '/charity-system/api/sys-labels/query/',
    labelRemove = '/charity-system/api/sys-labels/remove',
    editStatus = '/charity-system/api/sys-labels/status/',
    allLabel = '/charity-system/api/sys-labels/parentLabelName'
}
// 查询
export const queryLabel = (params: LabelQueryParams) => {
    return defHttp.post({ url: Api.labelList, params });
};
// 新增
export const LabelAdd = (params: LabelSaveParams) => {
    return defHttp.post({ url: Api.addLabel, params });
};
// 修改
export const LabelEdit = (params: LabelSaveParams) => {
    return defHttp.put({ url: Api.editLabel + params.id, params });
};
// 详情
export const LabelDetail = (id) => {
    return defHttp.get({ url: Api.labelDetail + id });
};
// 删除
export const labelRemove = (params) => {
    return defHttp.delete({ url: Api.labelRemove, params });
};
// 修改状态
export const editStatus = (id, params) => {
    return defHttp.post({ url: Api.editStatus + id, params });
};
// 查询所有一类标签
export const LabelAll = () => {
    return defHttp.get({ url: Api.allLabel });
};
