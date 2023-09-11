export interface FormOptions {
  field: string;
  label: string;
  required?: boolean;
  component:
    | 'Input'
    | 'InputPassword'
    | 'InputTextArea'
    | 'RadioGroup'
    | 'Select'
    | 'SelectMultiple'
    | 'CheckboxGroup';
  colProps?: { span: number };
  slot?: string;
  componentProps?: {
    placeholder?: string;
    options?: Option[];
    disabled?: boolean;
    appendText?: string;
    prependText?: string;
    data?: any[];
    showCheckbox?: Boolean;
    multiple?: Boolean;
    nodeKey?: string;
  };
  rules?: any[];
  dynamicRules?: any[];
  ifShow?: Function | boolean;
  show?: boolean;
  filterable?: boolean;
}

export interface Option {
  label: string;
  value: string;
}
