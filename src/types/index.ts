import * as Runtypes from 'runtypes'

export declare namespace Vercel {
  export type Alias = {
    alias: string
    deploymentId: string
  }

  export type DeploymentState =
    | 'BUILDING'
    | 'CANCELED'
    | 'ERROR'
    | 'QUEUED'
    | 'READY'

  export type Deployment = {
    created: number
    createdAt: number
    creator: {
      uid: string
    }
    instanceCount: number
    meta?: Record<string, any>
    state: DeploymentState
    target: string
    uid: string
    url: string | null // null if a deployment is still uploading
  }

  export type DeploymentWithAlias = Vercel.Deployment & {
    alias?: string
  }

  // https://vercel.com/docs/api#api-basics/errors
  export type Error = {
    code: string
    message: string
  }
}

// Or(Runtypes.Undefined).

// Create type with `runtypes`
export const PluginOptionsRuntype = Runtypes.Record({
  deployHook: Runtypes.String.Or(Runtypes.Undefined),
  deployLimit: Runtypes.Number.withConstraint(
    n => (n >= 1 && n <= 15) || `Number must be between 1 and 15`
  ),
  forceSmallLayout: Runtypes.Boolean.Or(Runtypes.Undefined),
  projectId: Runtypes.String,
  teamId: Runtypes.String.Or(Runtypes.Undefined),
  token: Runtypes.String,
})

// Generate TypeScript defintion from `RunTypes` derived type
export type PluginOptions = Runtypes.Static<typeof PluginOptionsRuntype>
