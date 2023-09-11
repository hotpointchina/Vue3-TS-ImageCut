// 处理环境变量
const warpperEnv = (envConf: Recordable = loadEnv()): ViteEnv => {
  // 此处为默认值，无需修改
  const ret: ViteEnv = {
    VITE_APP_BASE_URL: '',
    VITE_APP_BASE_URL_PREFIX: '',
    VITE_PORT: 8080,
    VITE_PROXY: [],
    VITE_MICRO: 'main',
    VITE_APP_TITLE: '',
    VITE_APP_STATIC_URL: '',
    VITE_PUBLIC_PATH: '',
    VITE_PROXY_DOMAIN: '',
    VITE_PROXY_DOMAIN_REAL: '',
    VITE_MOCK: false,
    VITE_ROUTER_HISTORY: '',
    VITE_LEGACY: false,
  };

  for (const envName of Object.keys(envConf)) {
    const envValue = envConf[envName];
    let realName =
      typeof envValue === 'string' ? envValue.replace(/\\n/g, '\n') : envValue;
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) {}
    }
    // console.log(process.env);
    ret[envName] = realName;
    // if (typeof realName === 'string') {
    //   process.env = { ...process.env, ...{ [envName]: realName } };
    //   // process.env[envName] = realName;
    // } else if (typeof realName === 'object') {
    //   process.env = { ...process.env, ...{ [envName]: JSON.stringify(realName) } };
    //   // process.env[envName] = JSON.stringify(realName);
    // }
  }
  return ret;
};

// 跨域代理重写
const regExps = (value: string, reg: string): string => {
  return value.replace(new RegExp(reg, 'g'), '');
};

// 环境变量
const loadEnv = (): ViteEnv => {
  return import.meta.env as any;
};

export { warpperEnv, regExps, loadEnv };
