import { defineStore } from 'pinia';
import { store } from '/@/stores';
import * as tsModel from '/@/views/upms/model/baseUserAdmin';
import { queryUser } from '/@/views/upms/api/useradmin';

export interface UserAdminState {
  pageTitle: '新增' | '编辑';
  list: tsModel.UserListParams[];
  total: number;
  // 当前页码
  pageNum: number;
  // 每页显示量
  pageSize: number;
  // 每页显示量选取列表
  pageSizeList: number[];
  editData: tsModel.UserSaveParams;
  query: tsModel.UserManyList;
  isShowEditPageData: boolean,
}

export const useUserAdminStore = defineStore({
  id: 'UserAdmin',
  state: (): UserAdminState => ({
    pageTitle: '新增',
    list: [],
    total: 0,
    pageNum: 1,
    pageSize: 10,
    pageSizeList: [10, 20, 30, 40, 50, 100],
    isShowEditPageData: false,
    editData: {
      id: '',
      org: '',
      username: '',
      nickname: '',
      password: '',
      cardNo: '',
      role: '',
      roleName: [],
      provinceName: '',
      cityName: '',
      countyName: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      mobile: '',
      email: '',
      status: '',
      avatar: '',
    },
    // 查询组件里的查询条件
    query: {
      nickname: '',
      orgName: '',
      orgCode: '',
      pageNum: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      role: '',
      roleId: '',
    },
  }),
  getters: {},
  actions: {
    // 设置页面信息
    setPageInfo(obj: { pageNum: number; pageSize?: number; pageSizeList?: number[] }) {
      this.pageNum = obj.pageNum ? obj.pageNum : this.pageNum;
      this.pageSize = obj.pageSize ? obj.pageSize : this.pageSize;
      this.pageSizeList = obj.pageSizeList ? obj.pageSizeList : this.pageSizeList;
    },

    // 获取列表数据
    async getList(data?: tsModel.UserManyList) {
      this.query.pageNum = this.pageNum;
      this.query.pageSize = this.pageSize;
      if (data) {
        this.query = { ...data };
        this.query.pageNum = this.pageNum;
        this.query.pageSize = this.pageSize;
      }
      const res = await queryUser(this.query);
      this.list = res.records as tsModel.UserListParams[];
      this.list.map((it) => {
        if (it.roleName.length > 1) {
          it.role = it.roleName.slice(0, 2).join('，') + '...';
        } else { it.role = it.roleName.join(); }
      });
      this.total = res.total;
    },
    addHandler(obj: tsModel.UserListParams) {
      this.list = [{ ...obj }, ...this.list];
      this.readyAdd();
    },
    editHandler(obj: tsModel.UserSaveParams) {
      this.pageTitle = '编辑';
      this.editData = { ...obj };
    },
    // 保存编辑
    saveEdited(obj: tsModel.UserListParams) {
      this.pageTitle = '新增';
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === obj.id) {
          this.list[i] = { ...this.list[i], ...obj };
          break;
        }
      }
      Object.keys(this.editData).forEach((key) => {
        switch (typeof this.editData[key]) {
          case 'string':
            this.editData[key] = '';
            break;
          case 'number':
            this.editData[key] = 0;
            break;
        }
      });
    },
    // 批量删除
    deleteChoose(arr: tsModel.UserListParams[]) {
      let template = JSON.parse(JSON.stringify(this.list));
      arr.forEach((obj) => {
        template = template.filter((rowItem) => rowItem.idNumber != obj.id);
      });
      this.list = template;
      template = null;
    },
    readyAdd() {
      this.pageTitle = '新增';
      Object.keys(this.editData).forEach((key) => {
        this.editData[key] = key !== 'name' ? '' : 0;
      });
    },
    // 清空 store
    repealStore() {
      this.pageTitle = '新增';
      Object.keys(this.editData).forEach((key) => {
        this.editData[key] = key !== 'name' ? '' : 0;
      });
      this.list = [];
    },
  },
});

export function useCrowdStoreWithOut() {
  return useUserAdminStore(store);
}
