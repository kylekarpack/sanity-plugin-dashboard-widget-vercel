import { PluginOptions, Vercel } from '@types'
import { useQuery } from 'react-query'

import fetcher from '../utils/fetcher'
import { API_ENDPOINT_ALIASES, API_ENDPOINT_DEPLOYMENTS } from '../constants'

type Options = {
  enabled?: boolean
}

const useDeployments = (pluginOptions: PluginOptions, options?: Options) => {
  const fetchUrl = fetcher(pluginOptions)

  // Fetch deployments
  const deployParams = new URLSearchParams()
  deployParams.set('limit', String(pluginOptions?.deployLimit))

  const {
    data: deploymentsData,
    isFetching: deploymentsIsFetching,
    isSuccess: deploymentsIsSuccess,
    error: deploymentsError,
  } = useQuery(
    'deployments',
    () => fetchUrl(API_ENDPOINT_DEPLOYMENTS, deployParams),
    {
      enabled: options?.enabled ?? true,
      refetchInterval: 20000, // ms
      refetchOnMount: true,
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: true,
    }
  )

  // Fetch aliases (only if deployments have been retrieved)
  const aliasParams = new URLSearchParams()
  aliasParams.set('limit', '20')

  const {
    data: aliasesData,
    isFetching: aliasesIsFetching,
    isSuccess: aliasesIsSuccess,
    error: aliasesError,
  } = useQuery('aliases', () => fetchUrl(API_ENDPOINT_ALIASES, aliasParams), {
    enabled: deploymentsData,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const aliases = aliasesData?.aliases as Vercel.Alias[]

  let deploymentsWithAlias: Vercel.DeploymentWithAlias[] | undefined = undefined

  if (aliases) {
    deploymentsWithAlias = deploymentsData?.deployments?.map(
      (val: Vercel.DeploymentWithAlias) => {
        const alias = aliases.find(alias => alias.deploymentId === val.uid)
        return {
          ...val,
          alias: alias?.alias,
        }
      }
    )
  }

  return {
    deployments: deploymentsWithAlias,
    error: aliasesError || deploymentsError,
    isFetching: aliasesIsFetching || deploymentsIsFetching,
    isSuccess: aliasesIsSuccess && deploymentsIsSuccess,
  }
}

export default useDeployments
