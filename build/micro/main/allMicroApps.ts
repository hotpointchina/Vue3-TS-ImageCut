export interface AllMicroApps {
  name: string;
  prefix: string;
  url: string;
}

export const allMicroApp: AllMicroApps[] = [
  { name: 'upms2', prefix: '/child/vite/', url: 'http://localhost:8085/child/vite/' },
  // { name: 'upms2', prefix: '/', url: 'http://localhost:8085/' },
  { name: 'upms', prefix: '/', url: 'http://localhost:4173/' },
];
