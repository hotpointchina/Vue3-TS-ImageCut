// 处理静态资源链接
import { loadEnv, warpperEnv } from '@build/index';

export default function baseStaticUrl(src = '') {
  const { VITE_APP_STATIC_URL } = warpperEnv(loadEnv());
  if (src) {
    return `${VITE_APP_STATIC_URL}${src}`;
  }
  return VITE_APP_STATIC_URL as string;
}
