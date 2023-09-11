// 多组件库的国际化和本地项目国际化兼容
import { createI18n } from 'vue-i18n/index';
import { localesConfigs } from './config';
import { getStorage } from '/@/utils/storage';
import { projectSettings } from '/@/settings/config/projectConfig';
/**
 * 国际化转换工具函数
 * @param message message
 * @param isI18n  如果true,获取对应的消息,否则返回本身
 * @returns message
 */
export function transformI18n(
  message: string | unknown | object = '',
  isI18n: boolean | unknown = false,
) {
  if (!message) {
    return '';
  }

  // 处理存储动态路由的title,格式 {zh:"",en:""}
  if (typeof message === 'object') {
    return message[i18n.global?.locale];
  }
  // console.log('i18n', i18n);
  if (isI18n) {
    // debugger;
    //@ts-ignore
    // return i18n.global.tc.call(i18n.global, message);
    return i18n.global.t(message);
  } else {
    return message;
  }
}
const projectLocale = projectSettings.locale;
const userLocale: ProjectConfigs = getStorage('PROJECT__SETTINGS__');
// console.log('userLocale', userLocale);
const locale = (userLocale && userLocale.locale) || projectLocale;
// 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除
export const $t = (key: string) => key;
export const i18n = createI18n({
  // locale: storageLocal.getItem('responsive-locale')?.locale ?? 'zh',
  locale: locale,
  fallbackLocale: 'zh',
  messages: localesConfigs,
});

export function usI18n(app: any) {
  app.use(i18n);
}
