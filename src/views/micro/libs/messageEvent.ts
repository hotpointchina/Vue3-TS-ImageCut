import { EventCenterForMicroApp } from '@micro-zoe/micro-app';
const createEvent = (name) => {
  if (window.eventCenterForAppNameVite) {
    window.eventCenterForAppNameVite = null;
  }
  window.eventCenterForAppNameVite = new EventCenterForMicroApp(name);
};
export default createEvent;
