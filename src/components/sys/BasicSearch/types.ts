export interface SearchOptions {
  label: string;
  key: string;
  span?: number;
  width?: number | string;
  component?: string;
  labelWidth?: number;
  componentProps?: {
    options?: any[];
  };
}
