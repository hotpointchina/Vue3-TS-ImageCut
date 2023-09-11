import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { getSettingsStorage, setSettingsStorage } from '/@/settings/settingsStorage';
import { deepMerge } from '/@/utils';

interface AppState {
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: Nullable<ProjectConfigs>;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    pageLoading: false,
    projectConfig: getSettingsStorage(),
  }),
  getters: {
    getProjectConfig(): ProjectConfigs {
      return this.projectConfig || ({} as ProjectConfigs);
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting;
    },
  },
  actions: {
    setProjectConfig(settings: DeepPartial<ProjectConfigs>) {
      this.projectConfig = deepMerge(this.projectConfig || {}, settings);
      setSettingsStorage(this.projectConfig);
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
