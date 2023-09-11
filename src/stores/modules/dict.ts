import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { reqDict } from '/@/api/sys/dict';
import { ResDict } from '/#/store';
import { getDictStorage, setDictStorage } from '/@/utils/storage/dict';

interface CodeState {
  codeDict: ResDict;
}

export const useDictStore = defineStore({
  id: 'app-dict',
  state: (): CodeState => ({
    codeDict: {},
  }),
  actions: {
    get(code: string) {
      return this.codeDict[code] || getDictStorage()[code];
    },
    setCodeDict(codeDict: ResDict) {
      this.codeDict = codeDict;
      setDictStorage(codeDict);
    },
    reqDict(tenantId?: string, projectId?: string) {
      // 读取数据
      reqDict(tenantId, projectId).then((res) => {
        this.setCodeDict(res);
      });
    },
  },
});

export function useDictStoreWithOut() {
  return useDictStore(store);
}
