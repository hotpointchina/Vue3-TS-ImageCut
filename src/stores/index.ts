import { createPinia } from 'pinia';

const store = createPinia();

export function installStore(app: any) {
  app.use(store);
}

export { store };
