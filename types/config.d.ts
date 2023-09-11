declare interface MenuSetting {
  collapsed: boolean;
}

declare interface ProjectConfigs {
  cacheType?: number;
  permissionMode?: string;
  menuSetting: MenuSetting;
  menuWidth: number;
  layout?: string;
  theme?: string;
  locale?: string;
  upms?: boolean;
}
