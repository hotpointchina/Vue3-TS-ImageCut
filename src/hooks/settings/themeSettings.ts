import { getStorage, setStorage } from '/@/utils/storage';
export function themeSettings() {
  function changeColor(color: string) {
    window.document.documentElement.setAttribute('data-theme', color);
    const setting: ProjectConfigs = getStorage('PROJECT__SETTINGS__');
    setting.theme = color;
    setStorage('PROJECT__SETTINGS__', setting);
  }
  return {
    changeColor,
  };
}
