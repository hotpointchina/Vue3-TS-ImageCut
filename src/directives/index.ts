/**
 * Configure and register global directives
 */
import { setupResizeDirective } from './elResizeDetector';
import { setupAuthDirective } from './auth';
// import { setupPermissionDirective } from './permission';
// import { setupLoadingDirective } from './loading';

export function installGlobDirectives(app: any) {
  // setupPermissionDirective(app);
  setupResizeDirective(app);
  setupAuthDirective(app);
  // setupLoadingDirective(app);
}
