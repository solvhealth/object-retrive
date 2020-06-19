import { FromRetrieve, RetrieveConfig } from './interfaces'
import { shouldReturnDefaultValue } from './util'

function retrieve<T>(path: string | string[],
                     defaultValue?: T,
                     config?: RetrieveConfig): FromRetrieve<T> {
  const _path = Array.isArray(path) ? path : path.split(config?.separator || '.')

  function from(obj: any): T {
    let retVal = obj

    for (let i = 0; i < _path.length; ++i) {
      const nextKey = _path[i]

      if (retVal) retVal = retVal[nextKey]
      else {
        retVal = defaultValue
        break
      }
    }

    if (shouldReturnDefaultValue(retVal, defaultValue, config))
      retVal = defaultValue

    return retVal
  }

  return { from }
}

export { retrieve as default, FromRetrieve, RetrieveConfig }
