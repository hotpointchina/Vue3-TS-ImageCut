import { getStorage, setStorage } from '/@/utils/storage';
import { useI18n } from 'vue-i18n/index';
import { buildMenus } from '/@/router/menus';
import router from '/@/router';
export function localeSettings() {
  const { locale } = useI18n();
  const { go } = router;
  function changeLang(type: string) {
    locale.value = type;
    const userLocale: ProjectConfigs = getStorage('PROJECT__SETTINGS__');
    userLocale.locale = type;
    setStorage('PROJECT__SETTINGS__', userLocale);
    // 刷新 菜单，同步刷新页面
    buildMenus();
    go(0);
  }
  // function saveLocale(type: string) {
  //   const userLocale: ProjectConfigs = getStorage('PROJECT__SETTINGS__');
  //   userLocale.Locale = type;
  //   setStorage('PROJECT__SETTINGS__', userLocale);
  // }

  return {
    // saveLocale,
    changeLang,
  };
}
