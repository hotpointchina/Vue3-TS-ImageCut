import { usePermissionStore } from '/@/stores/modules/permission';
import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';

export function usePermission() {
  const usePermission = usePermissionStore();

  function hasPermission(value: string | number | string[] | number[]) {
    if (!isArray(value)) {
      return usePermission.getPermCodeList?.includes(value as never);
    }
    return intersection(value as any[], usePermission.getPermCodeList).length > 0;
  }

  return { hasPermission };
}
