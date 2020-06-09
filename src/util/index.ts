import { RetrieveConfig } from '../interfaces'

export function isValidNest(obj: any, key: string) {
  return typeof obj === 'object' && obj !== null && obj.hasOwnProperty(key)
}

export function shouldReturnDefaultValue(retVal: any, config?: RetrieveConfig): boolean {
  if (!config ||
    !(config.overrideUndefined
      || config.defaultOnUndefined
      || config.defaultOnFalsy))
    return false

  if (config.overrideUndefined || config.defaultOnUndefined)
    return typeof retVal === 'undefined'

  return !retVal
}
