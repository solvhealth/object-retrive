import { RetrieveConfig } from '../interfaces'

function isSameType(val1: any, val2: any): boolean {
  const typeVal1 = typeof val1
  const typeVal2 = typeof val2

  if (typeVal1 !== typeVal2) return false
  if (typeVal1 === 'object')
    if (val1 === null || val2 === null && val1 !== val2) return false
    else return Array.isArray(val1) && Array.isArray(val2)
  if (typeVal1 === 'number') return isNaN(val1) === isNaN(val2);

  return true
}

export function shouldReturnDefaultValue(retVal: any,
                                         defaultValue: any,
                                         config?: RetrieveConfig): boolean {

  if (config?.guaranteeType && !isSameType(retVal, defaultValue)) return true
  if (config?.overrideUndefined || config?.defaultOnUndefined) return typeof retVal === 'undefined'
  if (config?.defaultOnFalsy) return !retVal

  return false
}
