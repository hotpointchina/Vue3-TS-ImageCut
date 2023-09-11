/*
 * @Author: DESKTOP-T44R7VC\user user@abc.com
 * @Date: 2022-11-07 10:19:05
 * @LastEditors: zhangwanrong
 * @LastEditTime: 2022-12-21 10:20:54
 * @FilePath: \chinapost_charity_vue\src\enums\pageEnum.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/dashboard',
  // BASE_HOME = '/',
  // error page path
  ERROR_PAGE = '/:all(.*)*',
  // BASE_HOME = '/report/mediumInfo',
  BASE_HOME_USER = '/report/mediumInfo',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',
  //告警管理->媒体管理
  MEDI_INFO = '/report/mediumInfo',
  // 首页
  BASE_INDEX = '/upms/index',
  //消息中心
  BASE_MESSAGE = '/upms/messagecenter',
  // 图片裁切
  CUT_IMAGE = '/upms/cut-images',
}

export const codeGenerationPages: string[] = [
  // '/dashboard',
];
