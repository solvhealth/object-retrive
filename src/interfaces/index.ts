export interface RetrieveConfig {
  defaultOnFalsy?: boolean;
  defaultOnUndefined?: boolean;
  guaranteeType?: boolean;
  separator?: string;
  /**
   * @deprecated
   */
  overrideUndefined?: boolean;
}

export interface FromRetrieve<T> {
  from: (obj: any) => T;
}
