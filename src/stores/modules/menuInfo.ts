import { defineStore } from 'pinia';
import { store } from '/@/stores';
import { Menu } from '/@/stores/types';

export interface menuInfoModel{
  sourceMenu: Menu[],
  currentFinddingMenu: any,
  currentButtonRights: string[]
}
export const useMenuInfoStore = defineStore({
  id: 'menuInfo',
  state: (): menuInfoModel => ({
    sourceMenu: [],
    currentFinddingMenu:{},
    currentButtonRights:[]
  }),
  actions: {
    getSingleMenu( str:string ){
      this.findMenu( JSON.parse( JSON.stringify( this.sourceMenu ) ), str );
      if( this.currentFinddingMenu && this.currentFinddingMenu.meta && Array.isArray(this.currentFinddingMenu.meta.permStr) ){
        this.currentFinddingMenu.meta.permStr.forEach(it=>{
          const k = it.split(':');
          this.currentButtonRights.push(k[k.length-1]);
        });
      }
      return JSON.parse(JSON.stringify(this.currentButtonRights));
    },
    findMenu( arr, path ){
      for(let i=0; i<arr.length; i++){
        if( arr[i].path == path ){
          this.currentFinddingMenu = JSON.parse(JSON.stringify(arr[i]));
          return JSON.parse(JSON.stringify(arr[i]));
        }
        if( Array.isArray( arr[i].children ) ){ this.findMenu( arr[i].children, path ) }
      }
    },
  }
});
// use outside the setup
export function useMenuInfoStoreWithOut() {
  return useMenuInfoStore(store);
}
