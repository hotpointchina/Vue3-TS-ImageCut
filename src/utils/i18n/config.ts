// import { siphonI18n } from './index';
import { set } from 'lodash-unified';
// element-plus国际化
import enLocale from 'element-plus/lib/locale/lang/en';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';

// 项目内自定义国际化
const zhModules = import.meta.globEager('./zh-CN/**/*.ts');
const enModules = import.meta.globEager('./en/**/*.ts');
/**
 * 从模块中抽取国际化
 * @param langs 存放国际化模块
 * @param prefix 语言 默认 zh-CN
 * @returns obj 格式：{模块名.**}
 */
export function siphonI18n(
  langs: Record<string, Record<string, any>>,
  prefix = 'zh-CN',
) {
  const langsObj: Recordable = {};
  Object.keys(langs).forEach((key: string) => {
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');
    const langFileModule = langs[key].default;

    if (moduleName) {
      if (objKey) {
        set(langsObj, moduleName, langsObj[moduleName] || {});
        set(langsObj[moduleName], objKey, langFileModule);
      } else {
        set(langsObj, moduleName, langFileModule || {});
      }
    }
  });
  return langsObj;
}
export const localesConfigs = {
  zh: {
    ...siphonI18n(zhModules, 'zh-CN'),
    ...zhLocale,
  },
  en: {
    ...siphonI18n(enModules, 'en'),
    ...enLocale,
  },
};
// console.log('localesConfigs', localesConfigs);
