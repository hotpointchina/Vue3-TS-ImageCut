export interface TableOptions {
  label: string; // 表头
  prop?: string; // 字段名称
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  slot?: string; // 自定义slot
  action?: boolean;
  fixed?: string;
  ellipsis?: Boolean; //一行展示，溢出展示...,添加title
  minWidth?: string; //最小宽度
  hideColumn?: Function | Boolean; //隐藏列
}
