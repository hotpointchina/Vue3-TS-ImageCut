import {BasicGenResult, tableQueryParam} from "/@/api/model/codegenModel";
export interface searchInfoModal{
  name: string,
  gender: string,
  age: number,
  helpType: string,
  idType: string,
  idNumber: string,
  remark: string,
}
export interface tableQueryForm {
  tableName:string;
  tableComment:string;
}
export interface tableItem {
  tableName:string;
  tableComment:string;
  createTime: string;
  updateTime: string;
}
export interface importTableItem {
  tableId:string;
  tableName:string;
  tableComment:string;
  status: string;
  createTime: string;
}
export interface viewTableParam {
  key:string;
  value:string;
}
 export type BasicFetchResultModel = BasicGenResult<tableItem>;

export type TablePageParams = tableQueryParam;
