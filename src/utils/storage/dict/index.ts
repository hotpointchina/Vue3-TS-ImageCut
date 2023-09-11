import { getStorage, setStorage } from '/@/utils/storage';
import { DICT_KEY } from '/@/enums/cacheEnum';
import { ResDict } from '/#/store';

export function getDictStorage(): ResDict {
  return getStorage(DICT_KEY);
}

export function setDictStorage(value: ResDict) {
  setStorage(DICT_KEY, value);
}
