import { getStorage, setStorage } from '/@/utils/storage';
import { CUR_MENU_KEY, MENU_KEY } from '/@/enums/cacheEnum';
import { Menu } from '/@/stores/types';

export function getMenuStorage(): Menu[] {
  return getStorage(MENU_KEY);
}

export function setMenuStorage(value: Menu[]) {
  setStorage(MENU_KEY, value);
}

export function getCurrentMenuStorage(): Menu {
  return getStorage(CUR_MENU_KEY);
}

export function setCurrentMenuStorage(value: Menu) {
  setStorage(CUR_MENU_KEY, value);
}
