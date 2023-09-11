import { defineStore } from 'pinia';
import { store } from '/@/stores';

export interface activitiesStateModel {
    activityId: number,
    isShowApprovePageData: boolean
}
export const useUpmsActivities = defineStore({
    id: 'upms-approveActivity',
    state: (): activitiesStateModel => ({
        activityId: 0,
        isShowApprovePageData: false
    })
});
// use outside the setup
export function useUpmsActivitiesStoreWithOut() {
    return useUpmsActivities(store);
}
