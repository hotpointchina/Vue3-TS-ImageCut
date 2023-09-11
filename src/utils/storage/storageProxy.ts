interface ProxyStorage {
  getItem(key: string): any;
  setItem(Key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

//sessionStorage operate
class StorageProxy implements ProxyStorage {
  protected storage: ProxyStorage;

  constructor(storageModel: ProxyStorage) {
    this.storage = storageModel;
  }
  
  // 存 persistent
  public setItem(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  // 取
  public getItem<T>(key: string): T {
    let res = null;
    try {
      res = JSON.parse(this.storage.getItem(key));
    } catch (error) {}
    return res = res ? res : this.storage.getItem(key)


    // return JSON.parse(this.storage.getItem(key));
    // if( typeof this.storage.getItem(key) == 'string' ){
    //   return JSON.parse(this.storage.getItem(key));
    // }else{
    //   return this.storage.getItem(key)
    // }
  }

  // 删
  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  // 清空
  public clear(): void {
    this.storage.clear();
  }
}

export const storageSession = new StorageProxy(sessionStorage);

export const storageLocal = new StorageProxy(localStorage);
