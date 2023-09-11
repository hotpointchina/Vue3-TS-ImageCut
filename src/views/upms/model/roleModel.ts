// 列表实体
export interface roleListParams {
    id: string;
    name?: string
    pwoName: string;
    pwoId?: string;
    status?: string;
    createTime?: string;
    createBy?: string;
    statusReplace?: string;
}
// 查询组实体

export interface roleQueryParams {
    pageNum: number;
    pageSize: number;
    name?: string
    pwoName: string;
    pwoId?: string;
}

// 新增/编辑 表单实体

export interface formType {
    id?: string;
    name: string;
    pwoName?: string;
    pwoId?: string;
    code: string;
}

// 公益组织
export interface pwoListType {
    label: string;
    value: string;
}

