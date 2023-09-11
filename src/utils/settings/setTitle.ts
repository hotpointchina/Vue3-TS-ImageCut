import { loadEnv, warpperEnv } from '@build/index';

export default function setTitle(title?: string) {
  const { VITE_APP_TITLE } = warpperEnv(loadEnv());
  const processTitle = VITE_APP_TITLE || 'CPVF-CLI';
  window.document.title = `${title ? `${title} | ` : ''} ${processTitle}`;
}
