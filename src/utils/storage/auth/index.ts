import { getStorage, setStorage } from '/@/utils/storage';
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { UserInfo } from '/#/store';

export function getAuthToken(): string {
  return getStorage(TOKEN_KEY);
}

export function setAuthToken(value: string) {
  setStorage(TOKEN_KEY, value);
}

export function getAuthStorage(): UserInfo {
  return getStorage(USER_INFO_KEY);
}

export function setAuthStorage(value: Nullable<UserInfo>) {
  return setStorage(USER_INFO_KEY, value);
}
