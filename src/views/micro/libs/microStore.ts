import { defineStore } from 'pinia';
import { store } from '/@/stores';

interface messageState {
  // 消息内容
  message: any;
  // 消息类型
  type: string;
}
interface microState extends messageState {
  // 记录当前存活的app名称
  activeApp: string;
  // 记录激活app后需要跳转的路由
  nextPath: string;
}

export const usemicroState = defineStore({
  id: 'micro-state',
  state: (): microState => ({
    // user info
    message: null,
    // token info
    type: '',
    activeApp: '',
    // 记录激活app后需要跳转的路由
    nextPath: '',
  }),
  getters: {
    getMessage(): any {
      return this.message;
    },
    getType(): string {
      return this.type;
    },
    getActiveApp(): string {
      return this.activeApp;
    },
    getNextPath(): string {
      return this.nextPath;
    },
  },
  actions: {
    setmicroState(info: messageState) {
      this.message = info.message;
      this.type = info.type;
    },
    resetmicroState() {
      this.message = null;
      this.type = '';
    },
    setActiveApp(app: string) {
      this.activeApp = app;
    },
    setNextPath(path: string) {
      this.nextPath = path;
    },
  },
});

// Need to be used outside the setup
export function usemicroStateWithOut() {
  return usemicroState(store);
}
