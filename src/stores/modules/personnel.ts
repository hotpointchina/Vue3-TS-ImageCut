import { defineStore } from 'pinia';
import { store } from '/@/stores';
import * as getRequest from '/@/views/upms/api/personnal';
import * as tsModel from '/@/views/upms/model/basePersonnal';


export interface personnalState {
    pageTitle: '新增' | '编辑',
    list: tsModel.UserListParams[],
    // 总条数
    total: number,
    // 当前页码
    pageNum: number,
    // 每页显示量
    pageSize: number,
    // 每页显示量选取列表
    pageSizeList: number[],
    editData: tsModel.UserSaveParams,
    // 查询时传递的参数
    queryInfo: tsModel.Userparams,
    // 新增 编辑页面是否显示
    isShowEditPageData: boolean,
}


export const usePersonnalStore = defineStore({
    id: 'personnalState',
    state: (): personnalState => ({
        pageTitle: '新增',
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizeList: [10, 20, 30, 40, 50, 100],
        editData: {
            id: '',
            pwoId: '',
            pwoName: '',
            username: '',
            nickname: '',//账号
            password: '',
            idNumber: '',
            roleName: [''],
            provinceName: '',
            cityName: '',
            countyName: '',
            provinceCode: '',
            cityCode: '',
            countyCode: '',
            mobile: '',
            email: '',
            orgName: '',
            orgCode: '',
            orgId: '',
            parentOrgCode: '',
        },
        queryInfo: {
            pageNum: 1,
            pageSize: 10,
            nickname: '',
            pwoName: '',
            pwoId: '',
        },
        isShowEditPageData: false
    }),
    getters: {

    },
    actions: {
        // 设置页面信息
        setPageInfo(
            obj: {
                pageNum: number,
                pageSize?: number,
                pageSizeList?: number[],
            }
        ) {
            this.pageNum = obj.pageNum ? obj.pageNum : this.pageNum;
            this.pageSize = obj.pageSize ? obj.pageSize : this.pageSize;
            this.pageSizeList = obj.pageSizeList ? obj.pageSizeList : this.pageSizeList;
            console.log(this.pageNum, this.pageSize, 11);
        },

        // 获取列表数据
        async getList(data?: tsModel.Userparams) {
            this.queryInfo.pageNum = this.pageNum
            this.queryInfo.pageSize = this.pageSize
            if (data) {
                this.queryInfo = { ...data };
                this.queryInfo.pageNum = this.pageNum
                this.queryInfo.pageSize = this.pageSize

            }
            // 调查询接口
            const res = await getRequest.queryPersonnal(this.queryInfo);
            this.list = res.data.result.records as tsModel.UserListParams[];
            this.list.map(item => {
                if (item.roleName.length > 1) {
                    item.role = item.roleName.slice(0, 1).join('，') + '...'
                } else {
                    item.role = item.roleName.join()
                }
            })
            this.total = res.data.result.total;
        },
        // 新增
        // addHandler(obj: tsModel.UserSaveParams) {
        //     this.list = [{ ...obj }, ...this.list];
        //     this.readyAdd();
        // },

        // 编辑
        editHandler() {
            this.pageTitle = '编辑';
            this.editData = { ...this.editData };
        },
        // 保存编辑
        saveEdited(obj: tsModel.UserSaveParams) {
            console.log(' store 编辑 obj -> ', obj);
            this.pageTitle = '新增';
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].id === obj.id) {
                    this.list[i] = { ...this.list[i], ...obj };
                    console.log(' store 保存编辑 【for】  this.list[i] -> ', this.list[i]);
                    break;
                }
            }

            Object.keys(this.editData).forEach(key => {
                switch (typeof (this.editData[key])) {
                    case 'string':
                        this.editData[key] = '';
                        break;
                    case 'number':
                        this.editData[key] = 0;
                        break;
                }
            });
            console.log(' store 保存编辑 this.list -> ', this.list);
        },



        // 批量删除
        deleteChoose(arr: tsModel.UserSaveParams[]) {
            let template = JSON.parse(JSON.stringify(this.list));
            arr.forEach(obj => {
                template = template.filter(rowItem => rowItem.idNumber != obj.id);
            });
            this.list = template;
            template = null;
        },

        // 清空 store
        readyAdd() {
            this.pageTitle = '新增';
            Object.keys(this.editData).forEach(key => {
                this.editData[key] = key !== 'name' ? '' : 0;
            });
        },
        // 清空 store
        repealStore() {
            this.pageTitle = '新增';
            Object.keys(this.editData).forEach(key => {
                this.editData[key] = key !== 'name' ? '' : 0;
            });
            this.list = [];
        },
    }
});

export function usePersonnalStoreWithOut() {
    return usePersonnalStore(store);
}