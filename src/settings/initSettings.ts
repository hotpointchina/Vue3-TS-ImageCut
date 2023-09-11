import { getSettingsStorage } from '/@/settings/settingsStorage';
import { deepMerge } from '/@/utils';
import { projectSettings } from '/@/settings/config/projectConfig';
import { useAppStore } from '/@/stores/modules/app';

export function initSettingsStore() {
  // 初始化阶段将项目配置存储到 缓存中
  const appStore = useAppStore();
  // 1、读取前端缓存 PROJECT_SETTINGS
  let projSettings: ProjectConfigs = getSettingsStorage();
  // 2、读取config
  // 3、两个配置进行组合后，重新写入缓存
  projSettings = deepMerge(projectSettings, projSettings || {});
  appStore.setProjectConfig(projSettings);
}
