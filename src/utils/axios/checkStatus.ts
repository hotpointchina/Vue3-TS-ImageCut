/*
 * @Author: wangneng wangneng@chinapost.com.cn
 * @Date: 2022-08-01 14:30:52
 * @LastEditors: wangneng wangneng@chinapost.com.cn
 * @LastEditTime: 2022-08-01 15:01:40
 * @FilePath: \cpvf-pools\src\utils\axios\checkStatus.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { ErrorMessageMode } from '/#/axios';
import { transformI18n } from '/@/utils/i18n';
import { useUserStoreWithOut } from '/@/stores/modules/user';
import { useMessage } from '/@/hooks/web/useMesage';

const { createMessage } = useMessage();
export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      errMessage = transformI18n('api.errMsg401', true);
      userStore.setToken(undefined);
      errMessage = transformI18n('api.errMsg401', true) || msg;
      userStore.logout(401);
      break;
    case 403:
      errMessage = transformI18n('api.errMsg403', true);
      break;
    case 404:
      errMessage = transformI18n('api.errMsg404', true);
      break;
    case 405:
      errMessage = transformI18n('api.errMsg405', true);
      break;
    case 408:
      errMessage = transformI18n('api.errMsg408', true);
      break;
    case 500:
      errMessage = transformI18n('api.errMsg500', true);
      break;
    case 501:
      errMessage = transformI18n('api.errMsg501', true);
      break;
    case 502:
      errMessage = transformI18n('api.errMsg502', true);
      break;
    case 503:
      errMessage = transformI18n('api.errMsg503', true);
      break;
    case 504:
      errMessage = transformI18n('api.errMsg504', true);
      break;
    case 505:
      errMessage = transformI18n('api.errMsg505', true);
      break;
    default:
  }

  errMessage = msg || errMessage;

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      // createErrorModal({ title: transformI18n('api.errorTip', true), content: errMessage });
    } else if (errorMessageMode === 'message') {
      createMessage.error(errMessage);
    }
  }
}
