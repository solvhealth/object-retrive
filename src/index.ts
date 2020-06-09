import { FromBinding, FromRetrieve, RetrieveConfig } from './interfaces'
import { isValidNest, shouldReturnDefaultValue } from './util'

function from(this: FromBinding, obj: any): any {
  const { splitPath, defaultValue, config } = this
  let retVal = obj

  for (let i = 0; i < splitPath.length; ++i) {
    const key = splitPath[i]
    if (key === undefined) break

    if (!isValidNest(retVal, key)) {
      retVal = defaultValue
      break
    }

    retVal = retVal[key]
  }

  if (shouldReturnDefaultValue(retVal, config))
    retVal = defaultValue

  return retVal
}

function retrieve(path: string,
                  defaultValue?: any,
                  config?: RetrieveConfig): FromRetrieve {

  const splitPath = path.split(config && config.separator || '.')

  return { from: from.bind({
      splitPath,
      defaultValue,
      config,
    }) }
}

export { retrieve as default, FromRetrieve, RetrieveConfig }

