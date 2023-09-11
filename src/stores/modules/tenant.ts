import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { ProjectInfo, TenantInfo, NoticeListParams } from '/@/api/model/Tenant';
import { getProjectList } from '/@/api/sys/tenant';
import { setHeaderInfo } from '/@/utils/storage/tenant';
import { UserInfo, HeaderTenantProject } from '/#/store';
import { messageSmall } from '/@/views/upms/api/messageCenter';
export interface TenantState {
  // projectInfos: ProjectInfo[];
  projectInfos: NoticeListParams[];
  tenantInfos: TenantInfo[];
  curTenant: TenantInfo;
  curProject: ProjectInfo;
}

// const useUserStore = useUserStoreWithOut();

export const useTenantStore = defineStore({
  id: 'app-tenant',
  state: (): TenantState => ({
    projectInfos: [],
    tenantInfos: [],
    curTenant: { id: '', tenantName: '', tenantAlias: '' },
    curProject: { id: '', projectName: '', projectAlias: '' },
  }),
  getters: {
    getProjectInfos(): NoticeListParams[] {
      return this.projectInfos;
    },
    getTenantInfos(): TenantInfo[] {
      return this.tenantInfos;
    },
    getCurTenant(): TenantInfo {
      return this.curTenant;
    },
    getCurProject(): ProjectInfo {
      return this.curProject;
    },
  },
  actions: {
    setCurTenant(tenantInfo: TenantInfo) {
      this.curTenant = tenantInfo;
    },
    setCurProject(projectInfo: ProjectInfo) {
      this.curProject = projectInfo;
    },
    setTenantList(tenantList: TenantInfo[]) {
      this.tenantInfos = tenantList;
    },
    // async setProjectList(projectList: ProjectInfo[]) {
    //   // this.projectInfos = projectList;
    //   const res = await messageSmall();
    //   console.log('setProjectList', res);
    // },
    async setProjectList() {
      // this.projectInfos = projectList;
      const res = await messageSmall();
      this.projectInfos = res
      // console.log('setProjectList', res);
    },
    setHeaderInfoStorage(info: HeaderTenantProject) {
      setHeaderInfo(info);
    },
    async requestData(userInfo: UserInfo) {
      await this.requestTenantInfos(userInfo);
      await this.requestProjectInfos(userInfo);
    },
    async requestTenantInfos(userInfo: UserInfo) {
      // const res = await getTenantList();
      // this.setTenantList(res);
      console.log(userInfo);
    },
    async requestProjectInfos(userInfo: Nullable<UserInfo> = null) {
      if (this.curTenant.id) {
        const res = await getProjectList(this.curTenant.id);
        // 修改缓存数据
        setHeaderInfo({
          tenantId: this.curTenant.id,
          tenantName: this.curTenant.tenantName,
          projectId: res.length > 0 ? res[0].id : '',
          projectName: res.length > 0 ? res[0].projectName : '',
        });
        // this.setProjectList(res);
        if (res.length > 0) {
          let projectInfo: ProjectInfo | undefined;
          if (userInfo) {
            projectInfo = res.find((item) => item.id === userInfo.projectId);
          } else {
            projectInfo = res[0];
          }

          if (projectInfo) {
            this.setCurProject(projectInfo);
          } else {
            this.setCurProject({
              id: '',
              projectName: '',
              projectAlias: '',
            });
          }
          // this.setCurProject(res[0]);
        } else {
          // 租户下不存在项目
          this.setCurProject({
            id: '',
            projectName: '',
            projectAlias: '',
          });
        }
      }
    },
  },
});

// use outside the setup
export function useTenantStoreWithOut() {
  return useTenantStore(store);
}
