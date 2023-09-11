export class tableQueryParam {
  tableName?:string;
  tableComment?:string;
  pageNum?: number;
  pageSize?: number;
  constructor() {
    this.pageNum = 1;
    this.pageSize = 10;
  }
}
export interface BasicGenResult<T extends any> {
  list: T[];
  total: number;
}
