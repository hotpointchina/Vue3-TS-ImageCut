import { Directive, DirectiveBinding } from 'vue';
import { usePermission } from '/@/hooks/web/usePermission';

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission();
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

export const auth: Directive = {
  mounted(el: Element, binding: DirectiveBinding) {
    isAuth(el, binding);
  },
};

export function setupAuthDirective(app: any) {
  app.directive('auth', auth);
}
