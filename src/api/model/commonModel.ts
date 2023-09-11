export interface seachGroupInfoModel{
  status: boolean,
  height: string
}
// table 自适应高度的 model
export interface autoTableHeightInfoModel{
  tableHeight: string,
  // 搜索组的状态
  seachGroupInfo: seachGroupInfoModel,
}
