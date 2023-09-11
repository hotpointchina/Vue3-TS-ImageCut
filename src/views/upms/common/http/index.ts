import { createAxios } from '/@/utils/axios';

export const sysPreFix = '/sys';

export const sysHttp = createAxios({
  requestOptions: {
    apiUrl: sysPreFix,
  },
});
