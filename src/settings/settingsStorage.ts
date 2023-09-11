import { getStorage, setStorage } from '/@/utils/storage';
import { PROJECT_SETTINGS } from '/@/enums/cacheEnum';

export function setSettingsStorage(config: Nullable<ProjectConfigs>) {
  setStorage(PROJECT_SETTINGS, config);
}

export function getSettingsStorage(): ProjectConfigs {
  return getStorage<ProjectConfigs>(PROJECT_SETTINGS);
}
