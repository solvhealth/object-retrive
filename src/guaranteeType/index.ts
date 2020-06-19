import retrieve, { FromRetrieve, RetrieveConfig } from '../index'

export default function <T>(path: string | string[],
                            defaultValue: T,
                            config?: RetrieveConfig): FromRetrieve<T> {

  const _config: RetrieveConfig = {
    ...config,
    guaranteeType: true,
  }

  return retrieve(path, defaultValue, _config);
}
