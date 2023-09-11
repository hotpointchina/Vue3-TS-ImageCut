export interface TreeItem {
  id?: string;
  label: string;
  parentId?: string;
  children?: TreeItem[];
  type?: string; // 资源类型
}

export interface CheckedData {
  checkedNodes: TreeItem[];
  checkedKeys: string[] | number[];
  halfCheckedNodes: TreeItem[];
  halfCheckedKeys: string[] | number[];
}
