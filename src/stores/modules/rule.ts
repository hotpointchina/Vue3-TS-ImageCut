import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { RuleSaveParams } from '/@/views/upms/model/rule';

export interface ruleStateModel {
    isEditing: boolean;
    modal: string;
    editDataInfo: RuleSaveParams;
}
export const useUpmsRule = defineStore({
    id: 'upms-address',
    state: (): ruleStateModel => ({
        isEditing: false,
        modal: 'add',
        editDataInfo: {
            id: '',
            ruleSalience: '',
            ruleName: '',
            ruleLhs: '',
            ruleRns: '',
            ruleType: '',
        },
    }),
    actions: {
        setEditDataInfo(row: RuleSaveParams) {
            this.isEditing = true;
            this.modal = 'modify';
            this.editDataInfo = { ...row };
        },
        resetState() {
            this.isEditing = false;
            this.modal = 'add';
            this.editDataInfo = {
                id: '',
                ruleSalience: '',
                ruleName: '',
                ruleLhs: '',
                ruleRns: '',
                ruleType: '',

            };
        },
    },
});

// use outside the setup
export function useUpmsRuleStoreWithOut() {
    return useUpmsRule(store);
}
