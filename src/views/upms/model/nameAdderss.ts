import {BasicPageParams} from "/@/api/model/baseModel";

export  interface NameAdderss {
  pageNum?: number;
  pageSize?: number;
  id?: number;
  pwoId?:number ;
  pwoName?: string;
  type?: string;
  doneeName?: string;
  phoneNumber?: string;
  status?: string;
  applyStatus?: string;
  applyPeople?: string;
}

//记录
export interface recordType {
  id: string;
  checkName?: string;
  checkOpinion?: string;
  checkStatus?: string;
  createTime?: string;
  approverOrg: string;
  approverOpinion: string;
  approverResult: string;
}
export type ActPageParams = BasicPageParams & {};

  export  interface  NameAddressSave{
  pwoName:string;	//所属组织名称	add
  doneeName:string; 	//受捐人姓名	add
  sex:string; 	//性别（0男 1女）	add
  age:string; 	//年龄	add
  provinceName:string;	//所在省	add
  cityName:string;	//所在地市	add
  countyName:string;	//所在区县	add
  doneeAddr:string;	//详细地址	add
  phoneNumber:string;	//联系电话	add
  idCard:string;	//身份证号	add
  urgentName:string;	//紧急联系人姓名 	add
  urgentRelation:string;	//紧急联系人关系(1-父子 2-母子 3-兄弟姐妹 4-朋友)	add
  urgentPhone:string;	//紧急联系人电话	add
  doneeExplain:string; 	//情况概述	add
  doneeIntroduce:string;	//情况介绍	add
  idCardMsg:string;	//身份证件	add
  doneeMsg:string; 	//其他凭证	add
}
