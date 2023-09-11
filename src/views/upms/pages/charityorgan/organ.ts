/**
 * 查询实体
 */
export interface Search {
  pageNum: number;
  pageSize: number;
  pwoName?: string;
  cityName?: string;
  countyName?: string;
  provinceName?: string;
  pwoCode?:string;
  cityCode?: string;
  countyCode?: string;
  provinceCode?: string;
}

/**
 * 表字段
 */
export interface tableData {
  addr?: string;
  cityCode?: string;
  cityName?: string;
  countyCode?: string;
  countyName?: string;
  createBy?: string;
  createTime?: string;
  foundTime?: string;
  head?: string;
  id?: string;
  isDeleted?: number;
  joinTime?: string;
  phoneNumber?: string;
  postalCode?: string;
  provinceCode?: string;
  provinceName?: string;
  pwoCode?: string;
  pwoIntroduce?: string;
  pwoName?: string;
  pwoType?: string;
  recordCode?: string;
  registerOffice?: string;
  registerTime?: string;
  remark?: string;
  status?: string;
  updateBy?: string;
  updateTime?: string;
  version?: number;
  index?:number;
}
//省市县
export interface AmcDistrict {
  distId: string;
  label: string;
  value: string;
}
