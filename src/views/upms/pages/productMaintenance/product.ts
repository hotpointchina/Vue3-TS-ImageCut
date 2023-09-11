
/** interface*/
export interface tableDataI {
  id?: number;
  wareCode?: string;
  wareName?: string;
  wareBrand?: string;
  wareType?: string;
  wareTypes?: string;
  suitAge?: string;
  wareIntroduce?: string;
  wareMsg?: string;
  status?: string;
  state?: string;
  stackTime?: string;
  createTime?: string;
  updateTime?: string;
  remark?: string;
}
export interface specsDataI {
  id?: string;
  wareId?: string;
  wareSpecs?: string;
  wareUnit?: string;
  warePrice?: string;
  wareSku?: string;
  status?: string;
  state?: string;
  remark?: string;
  index?: string;
}
export interface searchI {
  pageNum: number,
  pageSize: number,
  wareName?: string;
  wareType?: string;
  status?: string;
  startTime?: string;
  endTime?: string;

}
export interface detailI {
  createTime?: string;
  flagStatus?: string;
  id?: string;
  remark?: string;
  stackTime?: string;
  status?: string;
  suitAge?: string;
  updateTime?: string;
  wareBrand?: string;
  wareCode?: string;
  wareIntroduce?: string;
  wareMsg?: string;
  wareName?: string;
  wareType?: string;
  waresInfo?: string;
}