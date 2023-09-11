/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 10:19:05
 * @LastEditors: DESKTOP-T44R7VC\user user@abc.com
 * @LastEditTime: 2022-11-08 17:54:48
 * @FilePath: \gongyi_vue_demo\src\views\dashboard\components\types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ListData {
  imgUrl?: string;
  iconClass?: string;
  title?: string;
  subTitle?: string;
  href?: string;
  tag?: string;
  time?: string;
  projectName?: string;
  description?: string;
  createdDate?: string;
}

export interface titleList {
  id: number,
  img: string,
  title: string,
  num:string
}
