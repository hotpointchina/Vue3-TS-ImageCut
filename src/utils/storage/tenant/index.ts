import { getStorage, setStorage } from '/@/utils/storage';
import { HEADER_TENANT_PROJECT_KEY } from '/@/enums/cacheEnum';
import { HeaderTenantProject } from '/#/store';

export function getHeaderInfo(): HeaderTenantProject {
  return getStorage(HEADER_TENANT_PROJECT_KEY);
}

export function setHeaderInfo(value: HeaderTenantProject) {
  setStorage(HEADER_TENANT_PROJECT_KEY, value);
}
