export default function retrieve(path: string, defaultValue?: any): { from: (obj: any) => any } {
  function from(obj: any): any {
    let retVal = obj;
    const splitPath = path.split('.');

    while (splitPath.length) {
      const key = splitPath.shift();
      if (key === undefined) break;

      if (typeof retVal !== 'object' || !retVal.hasOwnProperty(key)) {
        retVal = defaultValue;
        break;
      }

      retVal = retVal[key];
    }

    return retVal;
  }

  return { from }
}

