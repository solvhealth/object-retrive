export interface RetrieveConfig {
  overrideUndefined?: boolean;
}

export interface FromRetrieve {
  from: (obj: any) => any;
}

function isValidNest(obj: any, key: string) {
  return typeof obj === 'object' && obj !== null && obj.hasOwnProperty(key);
}

export default function retrieve(path: string, defaultValue?: any, config?: RetrieveConfig): FromRetrieve {
  function from(obj: any): any {
    let retVal = obj;
    const splitPath: Array<string> = path.split('.');

    while (splitPath.length) {
      const key = splitPath.shift();
      if (key === undefined) break;

      if (!isValidNest(retVal, key)) {
        retVal = defaultValue;
        break;
      }

      retVal = retVal[key];
    }

    if (retVal === undefined && config?.overrideUndefined)
      retVal = defaultValue;

    return retVal;
  }

  return { from }
}

