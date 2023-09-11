import { CacheTypeEnum } from '/@/enums/cacheEnum';
import { PermissionModeEnum, I18nTypeEnum } from '/@/enums/appEnum';

export const projectSettings: ProjectConfigs = {
  // 缓存模式
  cacheType: CacheTypeEnum.SESSION,
  // 权限形式
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
  // 布局
  layout: 'vertical',
  // Menu config
  menuSetting: {
    // 是否折叠
    collapsed: false,
  },
  // 菜单宽度
  menuWidth: 200,
  // 国际化 I18nTypeEnum.zh I18nTypeEnum.en I18nTypeEnum.none
  locale: I18nTypeEnum.zh,
  // 主题 使用 element-plus
  theme: 'default',
  // 是否包含upms
  upms: true,
};
