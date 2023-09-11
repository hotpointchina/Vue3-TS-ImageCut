import { loadEnv, warpperEnv } from '@build/index';

export default function baseApiUrl(port?: number) {
  const { VITE_APP_BASE_URL } = warpperEnv(loadEnv());
  if (port) {
    return `${VITE_APP_BASE_URL}:${port}`;
  }
  return VITE_APP_BASE_URL;
}
