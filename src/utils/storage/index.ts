import { BasicKeys } from '/@/utils/storage/typing';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import { projectSettings } from '/@/settings/config/projectConfig';
import { storageLocal, storageSession } from '/@/utils/storage/storageProxy';

const { cacheType } = projectSettings;

const fn = cacheType === CacheTypeEnum.LOCAL ? storageLocal : storageSession;

export function getStorage<T>(key: BasicKeys) {
  return fn.getItem<T>(key) as T;
}

export function setStorage(key: BasicKeys, value) {
  return fn.setItem(key, value);
}

export function removeStorage(key: BasicKeys) {
  return fn.removeItem(key);
}

export function clearStorage() {
  return fn.clear();
}
