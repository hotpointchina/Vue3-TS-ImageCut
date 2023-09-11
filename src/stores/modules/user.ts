import { defineStore } from 'pinia';
import router, { removeUserRouter } from '/@/router';
import UaParser, { IResult as UaResult } from 'ua-parser-js';
import { UserInfo, } from '/#/store';
import { getAuthStorage, getAuthToken, setAuthToken, } from '/@/utils/storage/auth';
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { store } from '/@/stores';
import {login, logout, landingUserInfo, getCaptcha,} from '/@/api/sys';
import { LoginData, responseLoginInfo, natureResponseLoginInfo, authTokenModal, responseWithCodeUserInfo, } from '/@/api/model/User';
import { buildMenus } from '/@/router/menus';
import { usePermissionStore, usePermissionStoreWithOut, } from '/@/stores/modules/permission';
import { useTenantStoreWithOut } from '/@/stores/modules/tenant';
import { PageEnum } from '/@/enums/pageEnum';
import { useDictStoreWithOut } from '/@/stores/modules/dict';
import { useAppStore } from '/@/stores/modules/app';
import { sm2Encrypt } from '/@/utils/helper/crypto';
import { useMessage } from '/@/hooks/web/useMesage';
const { createMessage } = useMessage();


export interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  ua: UaResult;
  roleList: string[];
  uuid: string;
  isLoading: boolean;
  captchaBase64: string;
}
const defaultUserInfo = {
  id: '',
  token: '',
  name: '',
  avatar: '',
  nickname: '',
  username: '',
  orgName: '',
  roles: [],
  isSystemAdmin: false,
};

const permissionStoreWithOut = usePermissionStoreWithOut();
const tenantStoreWithOut = useTenantStoreWithOut();
const useDict = useDictStoreWithOut();
const useApp = useAppStore();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: { ...defaultUserInfo },
    token: undefined,
    ua: new UaParser().getResult(),
    roleList: [],
    uuid:'',
    isLoading: false,
    captchaBase64: '',
  }),
  getters: {
    getToken(): string { return this.token || getAuthToken(); },
    getUserInfo(): UserInfo { return this.userInfo && this.userInfo.id !== '' ? this.userInfo : getAuthStorage(); },
  },
  actions: {
    setUserInfo(payload: Nullable<UserInfo>) {
      this.userInfo = payload;
      sessionStorage.setItem( USER_INFO_KEY, JSON.stringify( payload ) );
    },
    setToken(token: string | undefined | null) {
      this.token = token ? token : '';
      setAuthToken(this.token);
    },
    resetUserInfo() {
      [ TOKEN_KEY, USER_INFO_KEY ].forEach(key=>{
        sessionStorage.removeItem( key );
      });
      tenantStoreWithOut.setCurTenant({
        id: '',
        tenantName: '',
        tenantAlias: '',
      });
      tenantStoreWithOut.setCurProject({
        id: '',
        projectName: '',
        projectAlias: '',
      });
      tenantStoreWithOut.setHeaderInfoStorage({});
    },
    async refreshUserData() {
      // 清空用户路由
      removeUserRouter();
      // 清除 menu菜单
      permissionStoreWithOut.setMenuList([]);
      // 刷新字典
      this.getDictStore();
      // 刷新菜单
      await buildMenus();
      // 打开home页
      await router.replace(this.getUserInfo.homePath || PageEnum.BASE_HOME);
    },
    tokenSetHandler(response: responseLoginInfo){
      this.token = (response.result as authTokenModal).authToken;
      sessionStorage.setItem( TOKEN_KEY, this.token );
    },
    async requestUserInfo(){
      let userInfoRes:responseWithCodeUserInfo = await landingUserInfo();
      return userInfoRes;
    },
    async login( loginData: LoginData ) {
      const { username, password, code } = loginData;
      let sendData:any = JSON.stringify({
        username: username.trim(),
        password: password,
        code: code,
        uuid: this.uuid,
      });
      sendData = sm2Encrypt( sendData );
      const response: responseLoginInfo = await login(sendData);
      if( !response ){
        return this.isLoading = false; }
      else {
        if(response.code == 'B0001'){
          return this.isLoading = false;
        }
      }
      // this.isLoading = false;
      this.tokenSetHandler( response );
      let userInfoRes:responseWithCodeUserInfo|boolean = false;
      try {
        userInfoRes = await this.requestUserInfo();
        if( !userInfoRes ){
          createMessage.error('获取用户信息失败，请检查网络后再次登录');
          this.isLoading = false;
          return this.logout();
        }
      } catch (error) {
        console.log( error);
        this.isLoading = false;
        return this.logout();
      }
      if(
        userInfoRes.toString().includes('401')
        || userInfoRes.toString().includes('403')
      ){ return this.isLoading = false; }
      this.isLoading = false;
      let userInfo = JSON.parse(JSON.stringify(userInfoRes.data.result));
      userInfo.token = this.token;
      this.setUserInfo(userInfo);
      const permissionStore = usePermissionStore();
      if (!permissionStore.getDynamicAddedRoute) { await buildMenus(); }
      await router.replace(userInfo.homePath || PageEnum.BASE_HOME);
    },
    getDictStore() {
      if (!useApp.getProjectConfig.upms) { return; }
      if (this.getUserInfo.isSystemAdmin) {
        useDict.reqDict();
      } else { useDict.reqDict(this.getUserInfo.tenantId, this.getUserInfo.projectId); }
    },
    async outAndGotoLoginPage(){
      await router.push({ name: 'Login' });
      this.resetUserInfo();
      permissionStoreWithOut.setDynamicAddedRoute(false);
      removeUserRouter();
      // 清除 menu菜单
      permissionStoreWithOut.setMenuList([]);
      this.token = '';
    },
    async logout( status = 0 ) {
      switch(status){
        case 401:
        // case 403:
          return this.outAndGotoLoginPage();
      }
      try{
        const res:natureResponseLoginInfo = await logout();
        if( res?.status == 403 ){ return this.outAndGotoLoginPage(); }
        createMessage.success( res.data.result as string );
        return this.outAndGotoLoginPage();
      }catch(err){ createMessage.error( err+'' ); }
    },
    async handleCaptchaGenerate   ()  {
      getCaptcha().then( res => {
        this.captchaBase64 = res.result.img;
        this.uuid = res.result.uuid;
      });
    },
    async verification(token: string) { return Promise.resolve(token); },
  },
});

// use outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
