declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare type Nullable<T> = T | null;

declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_APP_BASE_URL: string;
  VITE_APP_BASE_URL_PREFIX: string;
  VITE_PORT: number;
  VITE_APP_TITLE: string;
  VITE_APP_STATIC_URL: string;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
  VITE_MOCK: boolean;
  VITE_MICRO: 'main' | 'app';

  VITE_PROXY_DOMAIN: string;
  VITE_PROXY_DOMAIN_REAL: string;
  VITE_ROUTER_HISTORY: string;
  VITE_LEGACY: boolean;
}

declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Object ? DeepPartial<T[P]> : T[P];
};

declare interface Window {
  eventCenterForAppNameVite: any;
  __MICRO_APP_NAME__: string;
  __MICRO_APP_ENVIRONMENT__: string;
  __MICRO_APP_BASE_APPLICATION__: string;
}
