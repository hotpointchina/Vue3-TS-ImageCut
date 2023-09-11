export class BasicPageParams {
  pageNum?: number;
  pageSize?: number;
  constructor() {
    this.pageNum = 1;
    this.pageSize = 10;
  }
}

export interface BasicFetchResult<T extends any> {
  list: T[];
  total: number;
}
