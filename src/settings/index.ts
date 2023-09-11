import { projectSettings } from '/@/settings/config/projectConfig';

let config: ProjectConfigs = {} as ProjectConfigs;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = <T>(key?: string): T => {
  if (typeof key === 'string') {
    const arr = key.split('.');
    if (arr && arr.length) {
      let data: Nullable<object> = config;
      arr.forEach((v) => {
        if (data && typeof data[v] !== 'undefined') {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data as unknown as T;
    }
  }
  return config as unknown as T;
};

// 获取项目动态全局配置
export const getProjectConfig = (app: any): ProjectConfigs => {
  app.config.globalProperties.$config = getConfig();

  let $config = app.config.globalProperties.$config;
  // 自动注入项目配置
  if (app && $config && typeof projectSettings === 'object') {
    $config = Object.assign($config, projectSettings);
    app.config.globalProperties.$config = $config;
    // 设置全局配置
    setConfig($config);
  }
  // 设置全局baseURL
  app.config.globalProperties.$baseUrl = $config.baseURL;
  return $config;
  // return axios({
  //   baseURL: '',
  //   method: 'get',
  //   url: 'build/serverConfig.json',
  // })
  //   .then(({ data: config }) => {
  //
  //   })
  //   .catch(() => {
  //     throw '请在build文件夹下添加serverConfig.json配置文件';
  //   });
};

export { getConfig, setConfig };
