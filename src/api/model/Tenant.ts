export interface ProjectInfo {
  id: string;
  projectName: string;
  projectAlias: string;
}

export interface TenantInfo {
  id: string;
  tenantName: string;
  tenantAlias: string;
}
export interface NoticeListParams {
  id?: string;
  noticeTitle?: string;
  noticeContent?: string;
  publishTime?: string;
  isRead?: string;
  projectName?: string;
  projectAlias?: string;
}
