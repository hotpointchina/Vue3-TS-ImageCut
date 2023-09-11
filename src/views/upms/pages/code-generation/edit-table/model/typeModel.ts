export type voidFunction = (params:any)=>void;

export interface basicInfoFormData {
  // 表名
  tableName: String,
  // 表描述
  tableComment: String,
  // 实体类名称
  className: String,
  // 作者
  functionAuthor: String,
  // 备注
  remark: String,
}
export interface genInfoFormData {
  // 生成模板
  tplCategory: String,
  // 生成包路径
  packageName: String,
  // 生成模块名
  moduleName: String,
  // 生成业务名
  businessName: String,
  // 生成功能名
  functionName: String,
}

export interface TableDataType {
  columnName: string
  columnComment: string
  javaType: string
  javaField: string
  isInsert: boolean
  isEdit: boolean
  isList: boolean
  isQuery: boolean
  queryType: string
  isRequired: boolean
  htmlType: string
  dictType: string
}

export interface EditData {
  info:object,
  rows: TableDataType[]
};

export interface plodDataType<T> {
  plodData: T
}



export type formKeys = {
  [prop:string] : string
}

export type defaultProps<T> = {
  readonly plodData: T
}