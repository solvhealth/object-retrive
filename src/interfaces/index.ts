export interface RetrieveConfig {
  overrideUndefined?: boolean;
  defaultOnFalsy?: boolean;
  defaultOnUndefined?: boolean;
  separator?: string;
}

export interface FromRetrieve {
  from: (obj: any) => any;
}

export interface FromBinding {
  splitPath: Array<string>;
  defaultValue?: any;
  config?: RetrieveConfig;
}
